const orderService = require('../../services/xiaomi/ordersService')
const {isOrderInDB, saveOrderInDB} = require('../../database/xiaomi/ordersDB')

async function sendNewOrderXiaomi(req, res) {
  try {
    res.status(200).send()
    // @ts-ignore
    // if(sendOrder.length === 0){
      const newBody = await orderService.getOrderDetailsShopify(req.body.id)
      if(newBody.financial_status === 'paid') {
        // const sendOrder = await isOrderInDB(req.body.id)
        // @ts-ignore
        if(sendOrder.length !== 0 && sendOrder[0].ingramOrder !== null) return console.log('order already sent')
        const {data} = await orderService.getOrderFromShopify(newBody)
        try {
          const responseIngram = await orderService.sendOrderToIngram(data)
          console.log(JSON.stringify(responseIngram))
        } catch (error) {
          console.log(error.response.data, 'error enviando la orden a ingram')
          
        }
      } else {
      console.log('financial status not paid', newBody.financial_status)
    }
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  sendNewOrderXiaomi
}