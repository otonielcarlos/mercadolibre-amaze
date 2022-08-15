import {createHmac} from 'crypto'
import {config} from 'dotenv'
config()
// @ts-ignore
import {SECRET_LINIO } from process.env
function getSignature(orderId, event){

  
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * - 45000).toISOString().slice(0,-1)

  const encodedDate = encodeURIComponent(utc)
  
  if(event === 'GetOrder'){
    const concatenated = `Action=GetOrder&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=carlos%40bluediamondinnovation.com&Version=1.0`
    const hashOrder = createHmac('sha256', SECRET_LINIO)
                      .update(concatenated)
                      .digest('hex')
    return {url: concatenated, hash: hashOrder}

  } else if(event === 'GetOrderItems'){

    const action = `Action=GetOrderItems&Format=JSON&OrderId=${orderId}&Timestamp=${encodedDate}&UserID=carlos%40bluediamondinnovation.com&Version=1.0`
    const hashItems = createHmac('sha256', SECRET)
                      .update(action)
                      .digest('hex')
    return {urlItems: action, hashItems: hashItems}
    
  } else if(event === 'GetProducts'){
  
      const productAction = `Action=GetProducts&Filter=all&Format=JSON&Timestamp=${encodedDate}&UserID=carlos%40bluediamondinnovation.com&Version=1.0`
      const hashProducts = createHmac('sha256', SECRET)
                          .update(productAction)
                          .digest('hex')
      return {url: productAction, hash: hashProducts}
  }
}

module.exports = {
  getSignature
}