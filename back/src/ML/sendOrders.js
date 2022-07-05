const { default: axios } = require('axios');

let url = 'https://appleamaze.herokuapp.com/orderid/'

async function asyncPromOrders(arr) { 
  try {
    for(let order of arr){
      let url = `https://appleamaze.herokuapp.com/orderid/${order}`
      const orderResponse = await axios.get(url,{headers: {'Accept': 'application/json'}})
      console.log(orderResponse.data.customerPO, ' - ', orderResponse.data.globalorderid)
    }
  } catch (error) {
    console.log(error.response)
  }
}

let leftOrders = [
'2000003744500040',
'2000003744462932',
'2000003737628740',
'2000003740692402',
]

asyncPromOrders(leftOrders);




