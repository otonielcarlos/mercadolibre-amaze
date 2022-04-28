const { default: axios } = require('axios');

let url = 'https://appleamaze.herokuapp.com/orderid/'

async function asyncPromOrders(arr) { 
  try {
    let orders = arr.map(order => {
      // return  axios.get(`https://amazeml.herokuapp.com/orderid/${order}`)
      return  axios.get(`https://appleamaze.herokuapp.com/orderid/${order}`)
    })
    let ordersRes = await Promise.all(orders) 
    for(let res of ordersRes) {
      console.log(res.data.customerPO, res.data.globalorderid)
    }
  } catch (error) {
    console.log(error.response)
  }
}

let leftOrders = ['5426462169',
'5426625204',
'5426622398',
'5418758680',]

asyncPromOrders(leftOrders);
