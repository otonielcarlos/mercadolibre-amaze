const {createHmac} = require ('crypto')

require('dotenv').config()
const { SECRET_FALABELLA, FALABELLA_USER} = process.env
// console.log(TEST_LINIO, SECRET_FALABELLA, FALABELLA_USER)
function getSignature(orderId=false, event){
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * - 45000).toISOString().slice(0,-1)
  
  const encodedDate = encodeURIComponent(utc)
  if(orderId) {
    if(event === 'GetOrder'){
      const concatenated = `Action=GetOrder&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=${FALABELLA_USER}&Version=1.0`
      const hashOrder = createHmac('sha256', `${SECRET_FALABELLA}`)
                        .update(concatenated)
                        .digest('hex')
      return [concatenated, hashOrder]
  
    } else if(event === 'GetOrderItems'){
  
      const action = `Action=GetOrderItems&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=${FALABELLA_USER}&Version=1.0`
      const hashItems = createHmac('sha256', `${SECRET_FALABELLA}`)
                        .update(action)
                        .digest('hex')
      return [action, hashItems]
    }

  } else if(event === 'GetProducts') {
    const productAction = `Action=GetProducts&Filter=all&Format=JSON&Timestamp=${encodedDate}&UserID=${FALABELLA_USER}&Version=1.0`
    const hashProducts = createHmac('sha256', `${SECRET_FALABELLA}`)
                        .update(productAction)
                        .digest('hex')
    return [productAction, hashProducts]

  } else if(event === 'ProductUpdate') {
    const productAction = `Action=ProductUpdate&Filter=all&Format=XML&Timestamp=${encodedDate}&UserID=${FALABELLA_USER}&Version=1.0`
    const hashProducts = createHmac('sha256', `${SECRET_FALABELLA}`)
                        .update(productAction)
                        .digest('hex')
    return [productAction, hashProducts]
  }
}

module.exports = {
  getSignature
}