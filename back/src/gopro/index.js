const {default: WooCommerceRestApi} = require('@woocommerce/woocommerce-rest-api')
const { default: axios } = require('axios')
const { config } = require('dotenv')
config()
const {CK , CS, INGRAM_ORDER_URL, INGRAM_ORDER_URL_SANDBOX} = process.env
const {IngramHeaders} = require('../headers/ingramHeaders')
const {getEstado} = require('./getEstado')


const api = new WooCommerceRestApi({
  url: "https://gopro.pe",
  consumerKey: CK,
  consumerSecret: CS,
  version: "wc/v3"
})
async function getProcessingOrders() {
  try {
    const orders = await api.get('orders', {status: 'processing'})
    if(orders.data.length > 0){
      for(let order of orders.data){

        console.log(JSON.stringify(order))
        const {id} = order
        const {first_name, last_name, address_1, address_2, departamento, provincia, distrito} = order.shipping
        const name = `${first_name} ${last_name}`
        const {phone} = order.billing

        const {line_items} = order

        const lines = line_items.map((item, lineNumber) => {
        const line = {
          "customerLineNumber": lineNumber + 1,
          "ingramPartNumber":  `${item.sku}`,
          "quantity": `${item.quantity}`,
        }
        return line
        })
        const pickAndPackSkus = ["4989758", "4622281", "4309436"]

        const BreakException = 'added pickandpack'
        try {
          lines.forEach(line => {
            if(pickAndPackSkus.includes(line.ingramPartNumber)){
              lines.push({
                "customerLineNumber": lines[lines.length - 1].customerLineNumber + 1,
                "ingramPartNumber":  "5035113",
                "quantity": "1",
              })
              throw BreakException;
            }
          })
        } catch (breakException) {
          console.log(breakException)
        }
    
        lines.push({
          "customerLineNumber": lines[lines.length - 1].customerLineNumber + 1,
          "ingramPartNumber":  "5035111",
          "quantity": "1",
        })

        let addressLine1 = ''
        let addressLine2 = ''
        if(address_1.length > 35) {
          addressLine1 = address_1.slice(0,34)
          addressLine2 = address_1.slice(35)
        } else {
          addressLine1 = address_1
          addressLine2 = address_2
        }

        const estado = getEstado(departamento)

        let data = {
          "customerOrderNumber":`ULTIMAMILLA_${id}`,
          "notes": "",
          "shipToInfo": {
              "contact": `${name.substring(0,34)}`,
              "companyName": `${name.substring(0,34)}`,
              "name1": `${name.substring(0,34)}`,
              "addressLine1": `${addressLine1}`,
              "addressLine2": `${addressLine2.substring(0,34)}`,
              "addressLine3": `${phone}`,
              "addressLine4": `${provincia.substring(0,9)}`,
              "city":`${distrito}`,
              "state": `${estado}`,
              "countryCode": "PE"
          },
          "lines": lines,
          "additionalAttributes": [
              {
                  "attributeName": "allowDuplicateCustomerOrderNumber",
                  "attributeValue": "false"
              },
              {
                  "attributeName": "allowOrderOnCustomerHold",
                  "attributeValue": "true"
              }
          ]
        }

        const config = await IngramHeaders()
        if(order.status === "processing"){
          const sendOrder = await axios.post(INGRAM_ORDER_URL, data, config)
          const updateOrder = {
            status: 'completed'
          }
          await api.put(`orders/${id}`, updateOrder)

        }}
        return {"message": "ordenes enviadas"} 
    } else {
      return {"message": "no orders found"}
    }

  } catch (error) {
    console.log(error.response.data)
  }
}
getProcessingOrders()

module.exports = {
  getProcessingOrders
}
