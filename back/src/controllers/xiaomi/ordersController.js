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
      console.log(newBody.financial_status)
      if(newBody.financial_status === 'paid'){ 
        const {data} = await orderService.getOrderFromShopify(newBody)
        console.log(JSON.stringify(data))
        const responseIngram = await orderService.sendOrderToIngram(data)
        console.log(JSON.stringify(responseIngram))
      }
    } else {
      console.log('financial status not paid')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendNewOrderXiaomi
}