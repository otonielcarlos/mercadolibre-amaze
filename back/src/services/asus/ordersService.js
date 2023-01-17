const {default :axios} = require('axios')
const {getTodayAndYesterday, getTodayAndTime} = require('../../helpers/getTodayAndYesterday')
const {getEstado} = require('../../helpers/getEstado')
const { getAsusOrders,
        completeAsusOrdersInfo,
        getAsusOrdersCompleted,
        getAsusOrdersCompletedFromDates,
        updateFacturaStatus,
        checkAsusID,
        saveAsusId,
        getIngramSku,
        saveOrder
      } = require('../../database/asus/ordersDB')
const {magentoHeaders} = require('../../headers/magentoHeaders')
const { statusUpdateAsus } = require('./statusUpdateAsus')
const { getTokenAsus, getTokenAsusStaging } = require('../../tokens/magento')
const { IngramHeaders } = require('../../headers/ingramHeaders')


async function updateAllAsusOrdersInfo() {
  try {
    let arr = []
    const [today, yesterday] = getTodayAndYesterday()
    const config = await magentoHeaders()
    const all = await getAsusOrders(today, yesterday)
    // @ts-ignore
    if(!all.length){
      console.log('nada por actualizar en Asus orders')
    } else {
      // @ts-ignore
      for(let order of all){
        try {
          const url =`https://pe.store.asus.com/index.php/rest/V1/orders/${order.order_id}`
          const orderInfo = await axios.get(url, config)
          const {base_grand_total, items, billing_address, extension_attributes, total_item_count} = orderInfo.data
          const skus = items.map(item => `${item.sku},`).toString()
          const productos = items.map(item => `${item.name},`).toString()
          console.log(order.order_id)
          const mercadopagoInfo = JSON.parse(extension_attributes.payment_additional_info.find(info => info.key === "paymentResponse").value)
            const allInfo = {
            ...order,
            total_tienda: base_grand_total,
            total_mercadopago: mercadopagoInfo.transaction_details.net_received_amount,
            mercadopago_id: `${mercadopagoInfo.id}`,
            skus,
            total_item_count,
            productos,
            nombre: `${billing_address.firstname} ${billing_address.lastname}`,
            email: `${billing_address.email}`,
            address: `${billing_address.street[0]}, ${billing_address.city}, ${billing_address.region}, Peru `,
            document_type: extension_attributes.document_type,
            document_number: extension_attributes.document_number,
          }
          arr = [... arr, allInfo]
          
        } catch (error) {
          console.log('cant update', order.order_id)
        }
      }
      let query = ''
      arr.forEach(order => {
        const doc_type = order.document_type === undefined ? 'N/A' : order.document_type
        const doc_num = order.document_number === undefined ? 0 : order.document_number
        query+= `UPDATE ingramorders_asus SET mercadopago_id = '${order.mercadopago_id}', total_tienda = '${order.total_tienda}', total_mercadopago = '${order.total_mercadopago}', skus = '${order.skus}', cantidad =  ${order.total_item_count}, productos = '${order.productos}',nombre = '${order.nombre}', email = '${order.email}', direccion = '${order.address}',document_type = '${doc_type}', document_number = ${doc_num} WHERE order_id = '${order.order_id}';\n`
      })

      await completeAsusOrdersInfo(query)
      console.log('done')
    }
  } catch (error) {
    console.log(error)
  }
}

async function getAsusInformationOrders() {
  const [today, yesterday] = getTodayAndYesterday()
 return await getAsusOrdersCompleted(today, yesterday)
}

async function getAsusInformationOrdersFromDates(yesterday, today) {
 return await getAsusOrdersCompletedFromDates(today, yesterday)

}

async function updateAsusOrderStatusFactura(order_id) {
  await updateFacturaStatus(order_id)
  await statusUpdateAsus({order: order_id, status: 'InvoiceUploaded', comment: 'Comprobante de pago enviado al correo ', notify: 1})

}

async function sendAsusIdToIngram(order_id) {
  let status = await checkAsusID(order_id)
    if (!status) {
      let [day] = await getTodayAndTime()
      await saveAsusId(order_id, day)
      // const tokenMagento = await getTokenAsus()
      const tokenMagento = await getTokenAsusStaging()
      try {
        const urlOrders = `https://pestage.store.asus.com/index.php/rest/V1/orders/${order_id}`
        let config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenMagento}`,
          },
        }
        // @ts-ignore
        let orders = await axios.get(urlOrders, config)
    
        let newOrder = orders.data
        let arrayOfProducts = []
        let products = newOrder.items
    
        function getUniqueListBy(arr, key) {
          return [...new Map(arr.map(item => [item[key], item])).values()]
        }
        let filteredItems = getUniqueListBy(products, 'sku')
        filteredItems.forEach(product => {
          arrayOfProducts.push({ quantity: product.qty_ordered, sku: product.sku, price: product.price })
        })
    
        let entityId = newOrder.entity_id
        let incrementId = newOrder.increment_id
        let customerPo = newOrder.entity_id
        let firstName = newOrder.extension_attributes.shipping_assignments[0].shipping.address.firstname
        let lastName = newOrder.extension_attributes.shipping_assignments[0].shipping.address.lastname
        let phoneNumber = newOrder.extension_attributes.shipping_assignments[0].shipping.address.telephone
        let streetAddress1 = newOrder.extension_attributes.shipping_assignments[0].shipping.address.street[0]
        let streetAddress2 = newOrder.extension_attributes.shipping_assignments[0].shipping.address.street[1]
        let street = ''
        if (typeof streetAddress2 !== 'undefined') {
          street = `${streetAddress1} ${streetAddress2}`
        } else {
          street = `${streetAddress1}`
        }
    
        const attributes = newOrder.extension_attributes.shipping_assignments[0].shipping.address.extension_attributes
        let distrito = ''
        if(attributes.hasOwnProperty('district')){
            distrito = attributes.district.substring(0,9)
        } else {
            distrito = ''
        }
    
        let city = newOrder.extension_attributes.shipping_assignments[0].shipping.address.city
        let email = newOrder.extension_attributes.shipping_assignments[0].shipping.address.email
        let postalcode = newOrder.extension_attributes.shipping_assignments[0].shipping.address.postcode
        let region = newOrder.extension_attributes.shipping_assignments[0].shipping.address.region
        let status = newOrder.status
        let state = getEstado(region)
    
        let productsForIngram = []
        let i = 1
    
        for(let prod of arrayOfProducts){
          const ingramSku = await getIngramSku(prod.sku)
          productsForIngram.push({
            customerLineNumber: `${i}`,
            ingramPartNumber: ingramSku,
            quantity: prod.quantity,
    
          })
          i += 1
        }
    
        let firstname = firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        let lastname = lastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        let address = street.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        let addressline1 = ''
        let addressline2 = ''
    
        if (address.length > 35) {
          addressline1 = address.slice(0, 35)
          addressline2 = address.slice(35, address.length).substring(0, 34)
        } else {
          addressline1 = address
          addressline2 = ''
        }
    
        let fullName = `${firstname} ${lastname}`.substring(0, 34)
    
        let dataForIngramOrder = {
          orderId: customerPo,
          entityId: entityId,
          incrementId: incrementId,
          customerponumber: `ESHOPASUS_${incrementId}`,
          name1: `${fullName}`,
          name2: `${lastname}`,
          addressline1: `${addressline1}`,
          addressline2: `${addressline2}`,
          phonenumber: `${phoneNumber}`,
          city: `${city}`,
          state: `${state}`,
          email: `${email}`,
          distrito: `${distrito}`,
          postalcode: `${postalcode}`,
          lines: productsForIngram,
          status: `${status}`,
        }
        // console.log(dataForIngramOrder)

        const baseUrl = 'https://api.ingrammicro.com:443/resellers/v6/orders'
      
        const data = {
          "notes": "",
          "customerOrderNumber": `${dataForIngramOrder.customerponumber}`,
          "shipToInfo": {
            "contact": `${dataForIngramOrder.name1}`,
            "companyName": `${dataForIngramOrder.name1}`,
            "name1": `${dataForIngramOrder.name1}`.substring(0,34),
            "name2": `${dataForIngramOrder.name2}`.substring(0,34),
            "addressLine1": `${dataForIngramOrder.addressline1}`.substring(0,34),
            "addressLine2": `${dataForIngramOrder.addressline2}`.substring(0,34),
            "addressLine3": `${dataForIngramOrder.distrito}`,
            "addressLine4": `${dataForIngramOrder.phonenumber}`,
            "city": `${dataForIngramOrder.city}`,
            "state": `${dataForIngramOrder.state}`,
            "countryCode": "PE"
          },
          "lines": dataForIngramOrder.lines,
          "additionalAttributes": [
            {
              "attributeName": "allowDuplicateCustomerOrderNumber",
              "attributeValue": "false"
            },
            {
              "attributeName": "allowOrderOnCustomerHold",
              "attributeValue": "true"
            }
            // {
            //     "attributeName": "Z101",
            //     "attributeValue": `${dataForIngramOrder.name1}, ${dataForIngramOrder.addressline1} ${dataForIngramOrder.addressline2} ${}`
            // }
          ]
        }
        const headersIngram = await IngramHeaders()
        // @ts-ignore
        let sendOrder = await axios.post(baseUrl, data, headersIngram )
        
        let nv = sendOrder.data.orders[0].ingramOrderNumber
        
        const saveDate = new Date()
        saveDate.setHours(saveDate.getHours() - 6)
        let day = saveDate.toISOString().split('.')[0]

        await saveOrder(dataForIngramOrder.orderId,nv,dataForIngramOrder.customerponumber,dataForIngramOrder.status,day)
        } catch (error) {
            console.log(error)
        } 

    } else {
      console.log(order_id, ' ya existe')
  }
}

// updateAllAsusOrdersInfo()
module.exports = {
  updateAsusOrderStatusFactura,
  updateAllAsusOrdersInfo,
  getAsusInformationOrders,
  getAsusInformationOrdersFromDates,
  sendAsusIdToIngram
}   