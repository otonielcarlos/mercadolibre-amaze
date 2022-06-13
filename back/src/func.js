
const { default: axios } = require('axios')
const arrayChunk = require('array-chunk')
const { findOrder, db } = require('./db')
const { token } = require('./tokens/ml')
const { ingramToken } = require('./tokens/ingramToken')
const { sendMail } = require('./mailer')
// const { getTicket } = require('./etiqueta/printTicket')

const baseUrl = 'https://api.ingrammicro.com:443/resellers/v5/orders'

const addOrder = async (resource) => {
  try {
    let access_token = await token()
    console.log(access_token)
    const orderURL = `https://api.mercadolibre.com/orders/${resource}`
    let order = await axios.get(orderURL,{ headers: {'Authorization': `Bearer ${access_token}`}})
    console.log(orderURL)
    let shippingURL = `https://api.mercadolibre.com/shipments/${order.data.shipping.id}`
    let shipping = await axios.get(shippingURL, { headers: {'Authorization': `Bearer ${access_token}`}})
    let citye = shipping.data.receiver_address.city.name
    let cityFinal = shipping.data.receiver_address.city.name
    let state = shipping.data.receiver_address.state.name
    let stateFinal = shipping.data.receiver_address.state.name

    switch (citye) {
      case 'Amazonas': state = "01"; break;
      case 'Ancash': state = "02"; break;
      case 'Apurimac': state = "03"; break;
      case 'Arequipa': state = "04"; break;
      case 'Ayacucho': state = "05"; break;
      case 'Cajamarca': state = "06"; break;
      case 'Callao': state = "07"; break;
      case 'Cusco': state = "08"; break;
      case 'Huancavelica': state = "09"; break;
      case 'Huanuco': state = "10"; break;
      case 'Ica': state = "11"; break;
      case 'Junin': state = "12"; break;
      case 'La Libertad': state = "13"; break;
      case 'Lambayeque': state = "14"; break;
      case 'Lima': state = "15"; break;
      case 'Loreto': state = "16"; break;
      case 'Madre de Dios': state = "17"; break;
      case 'Moquegua': state = "18"; break;
      case 'Pasco': state = "19"; break;
      case 'Piura': state = "20"; break;
      case 'Puno': state = "21"; break;
      case 'San Martin': state = "22"; break;
      case 'Tacna': state = "23"; break;
      case 'Tumbes': state = "24"; break;
      case 'Ucayali': state = "25"; break;
      default: state = "00";
    }
     
if(state === "00") {
  switch (stateFinal) {
    case 'Amazonas': state = "01"; break;
    case 'Ancash': state = "02"; break;
    case 'Apurimac': state = "03"; break;
    case 'Arequipa': state = "04"; break;
    case 'Ayacucho': state = "05"; break;
    case 'Cajamarca': state = "06"; break;
    case 'Callao': state = "07"; break;
    case 'Cusco': state = "08"; break;
    case 'Huancavelica': state = "09"; break;
    case 'Huanuco': state = "10"; break;
    case 'Ica': state = "11"; break;
    case 'Junin': state = "12"; break;
    case 'La Libertad': state = "13"; break;
    case 'Lambayeque': state = "14"; break;
    case 'Lima Metropolitana': state = "15"; break;
    case 'Loreto': state = "16"; break;
    case 'Madre de Dios': state = "17"; break;
    case 'Moquegua': state = "18"; break;
    case 'Pasco': state = "19"; break;
    case 'Piura': state = "20"; break;
    case 'Puno': state = "21"; break;
    case 'San Martin': state = "22"; break;
    case 'Tacna': state = "23"; break;
    case 'Tumbes': state = "24"; break;
    case 'Ucayali': state = "25"; break;
    default: state = "15";
  }
}
    const id = order.data.id;
    const customerPo = `MLAPPLE_${id}`;

    const address = shipping.data.receiver_address.address_line;
    const shipTo = address.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    const fName = order.data.buyer.first_name;
    const firstName = fName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    const sName = order.data.buyer.last_name;
    const lastName = sName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    const name1 = `${firstName} ${lastName}`

    const zipCode = shipping.data.receiver_address.zip_code;
    const sku = order.data.order_items[0].item.seller_sku;
    const quantity = order.data.order_items[0].quantity;  
    
    let addressline1 = '' 
    let addressline2 = '';
    let addressline3 = '';

    if(shipTo.length > 35){
      addressline1 = shipTo.slice(0, 35);
      addressline2 = shipTo.slice(36, shipTo.length);
    } else {
      addressline1 = shipTo
      addressline2 = '';
    }
    
    if(addressline2.length > 40) {
      addressline2 = shipTo.slice(36, 70);
      addressline3 = shipTo.slice(70, shipTo.length);
    } else{
      addressline2 = shipTo.slice(36, 70);
      addressline3 = ''
    }

// let ingramToken = await axios.post(tokenUrl, postFields, header)
let imToken = await ingramToken();
let data = {
  "ordercreaterequest": {
    "requestpreamble": {
      "isocountrycode": "PE",
      "customernumber": "325831"
    },
    "ordercreatedetails": {
      "customerponumber": `${customerPo}`,
      "shiptoaddress": {
        "name1": `${name1}`,
        "addressline1": `${addressline1}`,
        "addressline2": `${addressline2}`,
        "addressline3": `${addressline3}`,
        "city": `${cityFinal}`,
        "state": `${state}`,
        "postalcode": `${zipCode}`,
        "countrycode": "PE"
      },
      "carriercode": "E1",
      "lines": [
        {
          "linetype": "P",
          "linenumber": "001",
          "quantity": `${quantity}`,
          "ingrampartnumber": `${sku}`
        }
      ]
    }
  }
}

console.log(JSON.stringify(data))
let responseFromIngram = await axios.post(baseUrl, data, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${imToken}`,
  }, 
}) 
let customerPO = responseFromIngram.data.serviceresponse.ordersummary.customerponumber

const dataToReturn = {
  globalorderid: responseFromIngram.data.serviceresponse.ordersummary.ordercreateresponse[0].globalorderid,
  customerPO: responseFromIngram.data.serviceresponse.ordersummary.customerponumber,
  trackingNumber: "null",
  orderId: id,
 // request: data,
 // ingram: responseFromIngram.data
}
console.log(dataToReturn)
return dataToReturn
  } catch (error) {
    console.log(error.data)
    // sendMail(id)
  }
}

module.exports = { addOrder }