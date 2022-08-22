// const url = `https://sellercenter-api.linio.com.pe?Action=GetProducts&Filter=all&Format=JSON&Timestamp=2022-08-18T17%3A19%3A34-05%3A00&UserID=carlos%40bluediamondinnovation.com&Version=1.0&Signature=5c65bf4731fab3b87dac1a23eb4f9d9061127a04a1462fc0221891dfb19b2d2a`
const {getSignature} = require('./orderUtils')
const signature = getSignature(false, 'GetProducts')
console.log(signature)



