const {default: WooCommerceRestApi} = require('@woocommerce/woocommerce-rest-api')
const { default: axios } = require('axios')
const { config } = require('dotenv')
config()
const {CK , CS, INGRAM_ORDER_URL, INGRAM_ORDER_URL_SANDBOX} = process.env
const {IngramHeaders} = require('../../headers/ingramHeaders')
const {getEstado} = require('../../helpers/getEstado')
const { mercadopagoToken } = require('../../tokens/mercadopago')
const {getTodayAndYesterday} = require('../../helpers/getTodayAndYesterday')
const { newGoProOrder } = require('../../database/gopro/ordersDB')


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
        const {first_name, last_name, address_1, address_2, departamento, provincia, distrito} = order.shipping
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
              "addressLine1": `${addressLine1}`,
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

        let dataForDatabase = {
          order_id: id,
          customerpo: data['customerOrderNumber'],
          nv: ''
        }
        const config = await IngramHeaders()
       // @ts-ignore
       const orderIngramRespose = await axios.post(INGRAM_ORDER_URL, data, config)
       const nv = orderIngramRespose.data.orders[0].ingramOrderNumber
        dataForDatabase['nv'] = nv
       await newGoProOrder(dataForDatabase)
      }
        return {"message": "ordenes enviadas"} 
    } else {
      return {"message": "no hay ordenes"}
    }

  } catch (error) {
    console.log(error.response.data)
  }
}

async function getGoProOrders() {
  try {
    const [today, yesterday] = getTodayAndYesterday()
    const orders = await api.get('orders', {'status':'completed', 'after': `${yesterday}T13:00:00`, 'before': `${today}T12:59:00`})
    const ingramConfig = await IngramHeaders()
    const results = orders.data.map(order => {
      const {id, shipping, billing, line_items, meta_data, total} = order
      const transactionId = meta_data.find(meta=> meta.key === "_Mercado_Pago_Payment_IDs").value
      const  [documento, valor] = meta_data

      const productLists = line_items.map(line =>  {
        return {
          sku: line.sku,
          name: line.name,
          qty: line.quantity,
        }
      })
      return {
        'oc': `ULTIMAMILLA_${id}`, 
        mpTransaction: transactionId,
        storeTotal: Number(total),
        nombre: `${shipping.first_name} ${shipping.last_name}`, 
        correo: billing.email,
        documento: documento.value,
        numero: valor.value,
        products: productLists,

      }
    })


    const withIngramOrderNumber = results.map(async (order) => {
      const url = `https://api.ingrammicro.com:443/resellers/v6/orders/search?customerOrderNumber=${order.oc}`
      const ingramData = await axios.get(url, ingramConfig)
      const {orders} = ingramData.data   //(order => order.subOrders.filter(sub => sub.subOrderStatus !== "REJECTED"))
      const {subOrderNumber, subOrderTotal} = orders.map(subOrder => subOrder.subOrders)
                        .filter(suborder => suborder.subOrderStatus !== "REJECTED")[0][0]
      const data = {
        ...order,
        ingramOrder: subOrderNumber,
        ingramTotal: subOrderTotal
      }
      
      return data
    })
    const allOrdersWithIngram = await Promise.all(withIngramOrderNumber)
    const allOrdersWithMercadopago = []
    for(let order of allOrdersWithIngram){
      try {
        const url = `https://api.mercadopago.com/v1/payments/${order.mpTransaction}`
        const token = await mercadopagoToken(true)
        const config = {headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`}}
        const mercadopagoOrder = await axios.get(url, config)
        const details = mercadopagoOrder.data.transaction_details
        allOrdersWithMercadopago.push({
          ...order,
          mercadopago_neto: details.net_received_amount
        })
      } catch (error) {
        console.log(error.response.data)
      }
    }
    return allOrdersWithMercadopago
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  sendProcessingOrders,
  getGoProOrders
}
