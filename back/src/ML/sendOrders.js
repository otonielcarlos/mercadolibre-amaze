const { default: axios } = require('axios');
const { findOrder } = require('./db');

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
'MLAPPLE_2000003876695228',
'MLAPPLE_2000003876884518',
'MLAPPLE_2000003876812226',
'MLAPPLE_2000003876058862',
'MLAPPLE_2000003875237712',
'MLAPPLE_2000003876814000',
]
async function testDB(){
  const res = await findOrder('2000003959546756')
  console.log(typeof res)
}
testDB();
