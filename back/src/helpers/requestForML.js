const joinItems = items => {
  let obj = {};

  items.forEach(item => {
    if(!obj[item.itemid]) obj[item.itemid] = [];
    obj[item.itemid].push({id: item.variationid, available_quantity: item.stock})
  })
  let result = Object.keys(obj).map( key => {
    return {itemid: key, data: {variations: obj[key]}}
  })
// console.log(obj)
return result

}

module.exports = {
  joinItems
}