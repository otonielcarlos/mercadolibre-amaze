const {default :axios} = require('axios')
const {getTodayAndYesterday} = require('../../helpers/getTodayAndYesterday')
const {getAsusOrders, completeAsusOrdersInfo, getAsusOrdersCompleted} = require('../../database/asus/ordersDB')

async function updateAllAsusOrdersInfo() {
  try {
    let arr = []
    const [today, yesterday] = getTodayAndYesterday()
    const all = await getAsusOrders(today, yesterday)
    if(!all.length){
      console.log('nada por actualizar en Asus orders')
    } else {
      for(let order of all){
        const url =`https://pe.store.asus.com/index.php/rest/V1/orders/${order.order_id}`
        const orderInfo = await axios.get(url,{headers: {'Authorization': 'Bearer 1fsvbmby1oehqcqx507jc64owhrwjrs2'}})
        const {base_grand_total, items, billing_address, extension_attributes, document_type, document_number, total_item_count} = orderInfo.data
        const skus = items.map(item => `${item.sku},`).toString()
        const mercadopagoInfo = JSON.parse(extension_attributes.payment_additional_info.find(info => info.key === "paymentResponse").value)
          const allInfo = {
          ...order,
          total_tienda: base_grand_total,
          total_mercadopago: mercadopagoInfo.transaction_details.net_received_amount,
          mercadopago_id: `${mercadopagoInfo.id}`,
          skus,
          total_item_count,
          nombre: `${billing_address.firstname} ${billing_address.lastname}`,
          email: `${billing_address.email}`,
          document_type: extension_attributes.document_type,
          document_number: extension_attributes.document_number
        }
        arr = [... arr, allInfo]
      }

      let query = ''
      arr.forEach(order => {
        query+= `UPDATE ingramorders_asus SET mercadopago_id = '${order.mercadopago_id}', total_tienda = '${order.total_tienda}', total_mercadopago = '${order.total_mercadopago}', skus = '${order.skus}', cantidad =  ${order.total_item_count}, nombre = '${order.nombre}', email = '${order.email}', document_type = '${order.document_type}', document_number = ${order.document_number} WHERE order_id = '${order.order_id}';\n`
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
module.exports = {
  updateAllAsusOrdersInfo,
  getAsusInformationOrders
}   