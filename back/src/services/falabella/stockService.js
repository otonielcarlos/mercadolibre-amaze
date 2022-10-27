const {default:axios} = require('axios')
const {getSignature} = require('./orderUtils')
const {getDataReadyToUpdate} = require('../../helpers/getDataReadyToUpdate')

async function updateStockFalabella() {
  // @ts-ignore
  const [url, hash] = getSignature(false, 'GetProducts')
  const productsUrl = 'https://sellercenter-api.falabella.com?' + url + '&Signature=' + hash
  // console.log(productsUrl)
  const productsFalabella = await axios.get(productsUrl)
  const products = productsFalabella.data.SuccessResponse.Body.Products.Product.map(product => {
    const {SellerSku} = product
    return `${SellerSku}`
  }).filter(sku => sku.length === 7)
    .filter(sku => sku !== '')
  const [updateUrl, hashUpdate] = getSignature(false, 'ProductUpdate')
  const productUpdateUrl = 'https://sellercenter-api.falabella.com?' + updateUrl + '&Signature=' + hashUpdate
  const updatedProducts = await getDataReadyToUpdate(products)
  const productsdata = updatedProducts?.filter(item => item.sku !== '')
  let requestString = ''

  productsdata?.forEach(item => {
    const {sku, stock} = item
    requestString += ` 
    <Product>
      <SellerSku>${sku}</SellerSku>
        <BusinessUnits>
          <BusinessUnit>
            <OperatorCode>fape</OperatorCode>
            <Stock>${Number(stock) > 50 ? Number(50) : Number(stock)}</Stock>
          </BusinessUnit>
        </BusinessUnits>
    </Product>`            
  })

  const requestXML = `<?xml version="1.0" encoding="UTF-8" ?><Request>${requestString}</Request>`
  // console.log(requestXML)
  // console.log(productUpdateUrl)
  const responseXML = await axios.post(productUpdateUrl, requestXML, {headers: {'accept': 'application/xml', 'content-type': 'application/x-www-form-urlencoded'}})
  console.log('falabella stock updated at: ', responseXML.data.SuccessResponse.Head.Timestamp)

}
module.exports = {
  updateStockFalabella
}



