const orderService = require('../../services/xiaomi/ordersService')
const {isOrderInDB, saveOrderInDB} = require('../../database/xiaomi/ordersDB')

async function sendNewOrderXiaomi(req, res) {
  try {
    res.status(200).send()
    console.log(req.body.id)
    const sendOrder = await isOrderInDB(req.body.id)
    // @ts-ignore
    if(sendOrder.length === 0){
      await saveOrderInDB(req.body.id)
      const newBody = await orderService.getOrderDetailsShopify(req.body.id)
      const {data} = await orderService.getOrderFromShopify(newBody)
      console.log(JSON.stringify(data))
      const responseIngram = await orderService.sendOrderToIngram(data)
      console.log(JSON.stringify(responseIngram))
    } else {
      console.log('order already in Ingram', req.body.order_number)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendNewOrderXiaomi
}