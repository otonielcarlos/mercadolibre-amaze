const {getOrderFromShopify, getOrderDetailsShopify} = require('./ordersService')


const arr = [
5140210581739,
5140216086763,
5140229325035,
5140234305771,
5140239483115,
5140498546923,
5140524073195,
5140534984939,
5185778647275,
5189570330859,
5190335627499,
5190374064363,
5190378684651,
5190523912427,
5193067725035,
5193219309803,
5193319547115,
]

async function fillData(orders) {
  for(let order of orders) {
    try {
      const body = await getOrderDetailsShopify(order)
      await getOrderFromShopify(body)
    } catch (error) {
      console.log(error)
    }
  }
}

fillData(arr)