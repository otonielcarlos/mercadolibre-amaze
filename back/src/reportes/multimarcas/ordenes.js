const {default: axios} = require('axios')
const { IngramHeaders } = require('../../headers/ingramHeaders')
const {getTodayAndYesterday} = require('../../helpers/getTodayAndYesterday')
const { ingramToken } = require('../../tokens/ingramToken')
const {	getTokens } = require('../../tokens/ml')
async function getOrdenes(){
  try {
    const [hoy, ayer] = getTodayAndYesterday()
    const [apple, multi] = await getTokens()
    // console.log(hoy, ayer)
    // const url = `https://api.mercadolibre.com/orders/search?seller=621991073&order.date_created.from=2023-03-10T12:00:00.000-00:00&order.date_created.to=${hoy}T18:00:00.000-00:00&access_token=${multi}`
    const url = `https://api.mercadolibre.com/orders/search?seller=766642543&order.date_created.from=${hoy}T12:00:00.000-00:00&order.date_created.to=${hoy}T18:00:00.000-00:00&access_token=${apple}`
    console.log(url)
    const ordenes = await axios.get(url)  

    const dataFilter = ordenes.data.results.map(orden => {
      const {payments, shipping, id, order_items} = orden
      return {payments, shipping: shipping.id, id, order_items}
    })

    const paymentsFiltered = dataFilter.map(orden => {
      // console.log(orden.payments)
      const orderApproved = orden.payments.find(status => status.status === 'approved').total_paid_amount
      delete orden.payments
      return {...orden, total_paid_mercadopago:  orderApproved}
    })
    const orderItemsFilter = paymentsFiltered.map(orden => {
      // const {item, quantity, sale_fee} = orden
      const quantity = orden.order_items[0].quantity 
      const sale_fee = orden.order_items[0].sale_fee 
      const sku = orden.order_items[0].item.seller_sku
      const title = orden.order_items[0].item.title
      delete orden.order_items
      return {...orden, quantity, sale_fee, sku, title}
    })
    const completedOrders = await getOrdenIngram(orderItemsFilter)   
    console.log(completedOrders)
    // console.log(orderItemsFilter[0])
  } catch (error) {
    console.log(error)
  }
}

async function getOrdenIngram(ordenes){
  const tempArr = []
  for(let orden of ordenes) {
    try {
      const customerOrderNumber = `ML_${orden.id}`
      const config = await IngramHeaders()
      const url = `https://api.ingrammicro.com:443/resellers/v6/orders/search?customerOrderNumber=${customerOrderNumber}`
      // console.log(url, config)
      const ingramOrder = await axios.get(url, config)
      const {ingramOrderNumber, orderStatus} = ingramOrder.data.orders.find(({orderStatus}) => orderStatus === 'PROCESSING' || orderStatus === 'OPEN')
      orden["ingramOrderNumber"] = ingramOrderNumber
      orden["orderStatus"] = orderStatus
      tempArr.push(orden)
      // console.log(orden)
    } catch (error) {
      // console.log(error)
    }
  }
  // console.log(ordenes)
  return tempArr
}

getOrdenes()