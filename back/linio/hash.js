const {createHmac} = require ('crypto')
const {config} = require ('dotenv')
config()
// @ts-ignore
const { SECRET_LINIO, LINIO_USER } = process.env
function getSignature(orderId, event){

  
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * - 45000).toISOString().slice(0,-1)

  const encodedDate = encodeURIComponent(utc)
  
  if(event === 'GetOrder'){
    const concatenated = `Action=GetOrder&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=${LINIO_USER}&Version=1.0`
    const hashOrder = createHmac('sha256', `${SECRET_LINIO}`)
                      .update(concatenated)
                      .digest('hex')
    return {url: concatenated, hash: hashOrder}

  } else if(event === 'GetOrderItems'){

    const action = `Action=GetOrderItems&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=${LINIO_USER}&Version=1.0`
    const hashItems = createHmac('sha256', `${SECRET_LINIO}`)
                      .update(action)
                      .digest('hex')
    return {urlItems: action, hashItems: hashItems}
    
  } else if(event === 'GetProducts'){
  
      const productAction = `Action=GetProducts&Filter=all&Format=JSON&Timestamp=${encodedDate}&UserID=${LINIO_USER}&Version=1.0`
      const hashProducts = createHmac('sha256', `${SECRET_LINIO}`)
                          .update(productAction)
                          .digest('hex')
      return {url: productAction, hash: hashProducts}
  }
}

module.exports = {
  getSignature
}