const {default:axios} = require('axios')
const {getSignature} = require('./orderUtils')
const {getDataReadyToUpdate} = require('../../helpers/getDataReadyToUpdate')

async function updateStockLinio() {
  // @ts-ignore
  const [url, hash] = getSignature(false, 'GetProducts')
  const productsUrl = 'https://sellercenter-api.linio.com.pe?' + url + '&Signature=' + hash
  const productsLinio = await axios.get(productsUrl)
  const products = productsLinio.data.SuccessResponse.Body.Products.Product.map(product => {
    const {SellerSku} = product
    return `${SellerSku}`
  }).filter(sku => sku.length === 7)
    .filter(sku => sku !== '')
  const [updateUrl, hashUpdate] = getSignature(false, 'ProductUpdate')
  const productUpdateUrl = 'https://sellercenter-api.linio.com.pe?' + updateUrl + '&Signature=' + hashUpdate
  const updatedProducts = await getDataReadyToUpdate(products)
  const productsdata = updatedProducts?.filter(item => item.sku !== '')
  let requestString = ''

  productsdata?.forEach(item => {
    const {sku, stock} = item
    requestString += `<Product>
              <SellerSku>${sku}</SellerSku>
              <Quantity>${stock}</Quantity>
            </Product>`
  })

  const requestXML = `<Request>${requestString}</Request>`
  const responseXML = await axios.post(productUpdateUrl, requestXML, {headers: {'Content-Type': 'text/xml'}})
  console.log('linio stock updated at: ', responseXML.data.SuccessResponse.Head.Timestamp)
}

module.exports = {
  updateStockLinio
}



