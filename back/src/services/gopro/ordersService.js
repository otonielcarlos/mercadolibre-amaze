const {default: WooCommerceRestApi} = require('@woocommerce/woocommerce-rest-api')
const { default: axios } = require('axios')
const { config } = require('dotenv')
config()
const {CK , CS, INGRAM_ORDER_URL, INGRAM_ORDER_URL_SANDBOX} = process.env
const {IngramHeaders} = require('../../headers/ingramHeaders')
const {getEstado} = require('../../helpers/getEstado')
const { mercadopagoToken } = require('../../tokens/mercadopago')
const {getTodayAndYesterday} = require('../../helpers/getTodayAndYesterday')
const { newGoProOrder, updateDeliveryGoPro, getGoProOrdersFromDB, updateOrderGoProInDB } = require('../../database/gopro/ordersDB')


const api = new WooCommerceRestApi({
  url: "https://gopro.pe",
  // @ts-ignore
  consumerKey: CK,
    // @ts-ignore
  consumerSecret: CS,
  version: "wc/v3"
})
async function sendProcessingOrders() {
  try {
    const orders = await api.get('orders', {status: 'processing'})
    const updateOrder = {
      status: 'completed'
    }
   
    if(orders.data.length > 0){
      for(let order of orders.data){
        const {id} = order
        await api.put(`orders/${id}`, updateOrder)
        const {first_name, last_name, address_1, address_2, departamento, provincia, distrito, date_created} = order.shipping
        const name = `${first_name} ${last_name}`
        const {phone} = order.billing

        const {line_items} = order

        const lines = line_items.map((item, lineNumber) => {
        const line = {
          "customerLineNumber": lineNumber + 1,
          "ingramPartNumber":  `${item.sku}`,
          "quantity": `${item.quantity}`,
        }
        return line
        })
        const pickAndPackSkus = ["4989758", "4622281", "4309436"]

        const BreakException = 'added pickandpack'
        try {
          lines.forEach(line => {
            if(pickAndPackSkus.includes(line.ingramPartNumber)){
              lines.push({
                "customerLineNumber": lines[lines.length - 1].customerLineNumber + 1,
                "ingramPartNumber":  "5035113",
                "quantity": "1",
              })
              throw BreakException;
            }
          })
        } catch (breakException) {
          console.log(breakException)
        }
    
        lines.push({
          "customerLineNumber": lines[lines.length - 1].customerLineNumber + 1,
          "ingramPartNumber":  "5035111",
          "quantity": "1",
        })

        let addressLine1 = ''
        let addressLine2 = ''
        if(address_1.length > 35) {
          addressLine1 = address_1.slice(0,34)
          addressLine2 = address_1.slice(35)
        } else {
          addressLine1 = address_1
          addressLine2 = address_2
        }

        const estado = getEstado(departamento)

        let data = {
          "customerOrderNumber":`ULTIMAMILLA_${id}`,
          "notes": "",
          "shipToInfo": {
              "contact": `${name.substring(0,34)}`,
              "companyName": `${name.substring(0,34)}`,
              "name1": `${name.substring(0,34)}`,
              "addressLine1": `${addressLine1.substring(0,34)}`,
              "addressLine2": `${addressLine2.substring(0,34)}`,
              "addressLine3": `${phone}`,
              "addressLine4": `${provincia.substring(0,9)}`,
              "city":`${distrito}`,
              "state": `${estado}`,
              "countryCode": "PE"
          },
          "lines": lines,
          "additionalAttributes": [
              {
                  "attributeName": "allowDuplicateCustomerOrderNumber",
                  "attributeValue": "false"
              },
              {
                  "attributeName": "allowOrderOnCustomerHold",
                  "attributeValue": "true"
              }
          ]
        }
        console.log(data)
        const [fecha, hora] = date_created.split('T')

        let dataForDatabase = {
          order_id: id,
          customerpo: data['customerOrderNumber'],
          nv: '',
          date: `${fecha} ${hora}`
        }
        const config = await IngramHeaders()
       // @ts-ignore
       const orderIngramRespose = await axios.post(INGRAM_ORDER_URL, data, config)
       console.log(orderIngramRespose.data)
       const nv = orderIngramRespose.data.orders[0].ingramOrderNumber
        dataForDatabase['nv'] = nv
       await newGoProOrder({order_id: dataForDatabase.order_id, customerpo: dataForDatabase.customerpo, nv: dataForDatabase.nv, date: dataForDatabase.date})
      }
        return {"message": "ordenes enviadas"} 
    } else {
      return {"message": "no hay ordenes"}
    }

  } catch (error) {
    console.log(error.response.data)
  }
}

async function updateGoProOrdersInfo() {
  const tokenmp = await mercadopagoToken(true)
  const orders = await getGoProOrdersFromDB()
  // @ts-ignore
  for(let order of orders) {
    try {
        let query = ''
        const orderFromGoPro = await api.get(`orders/${order.order_id}`)
        const {id, date_created, billing, meta_data, line_items, total} = orderFromGoPro.data
        const documento = meta_data.find(meta => meta.key === "billing_tipo_documento").value
        const document_number = meta_data.find(meta => meta.key === "billing_documento").value
        const mercadopago_id = meta_data.find(meta => meta.key === "_Mercado_Pago_Payment_IDs").value.split(',').pop().trim()
        const name = `${billing.first_name} ${billing.last_name}`
        const direccion = `${billing.address_1} ${billing.address_2}, ${billing.distrito}, ${billing.provincia}, ${billing.departamento}, Perú. T: ${billing.phone}`
        const skus = line_items.map(item => `${item.sku}`).join()
        const qty = line_items.map(item => item.quantity).reduce((curr, total) => curr + total, 0)
        const productNames = line_items.map(item => `${item.name}`).join()
        const email = billing.email
        const mercadopagoPayment = await axios.get(`https://api.mercadopago.com/v1/payments/${mercadopago_id}`, {headers: {'Authorization': `Bearer ${tokenmp}`}})
        const netAmout  = mercadopagoPayment.data.transaction_details.net_received_amount

        query = `UPDATE gopro_orders SET mercadopago_id = '${mercadopago_id}', date = '${date_created}', total_tienda = '${total}', total_mp = '${netAmout}', quantity = ${qty}, skus = '${skus}', product_names = '${productNames}', name = '${name}', email = '${email}', address = '${direccion}', document_type = '${documento}', document_number = '${document_number}' WHERE order_id = '${id}';`

        console.log(query)
        await updateOrderGoProInDB(query)

      } catch (error) {
        console.log(error)
      }
    }
}

async function deliveryGoProUpdate({order, dispatcher, delivery}) {
  await updateDeliveryGoPro({order, dispatcher, delivery})
}


updateGoProOrdersInfo()
module.exports = {
  sendProcessingOrders,
  updateGoProOrdersInfo,
  deliveryGoProUpdate
}
