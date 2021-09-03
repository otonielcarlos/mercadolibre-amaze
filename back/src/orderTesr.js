const axios = require('axios');
const arrayChunk = require('array-chunk');
const { findOrder, db } = require('./db');
const { token } = require('./ml');

let i = 0;
let itemsChunk = [];
const baseUrl =
  'https://api.ingrammicro.com:443/resellers/v5/orders';

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const tokenUrl = 'https://api.ingrammicro.com:443/oauth/oauth30/token';
const postFields =
  'grant_type=client_credentials&client_id=peCS1OtW2QSK8iCAm52bcE6Wl5R8oRci&client_secret=qk4KtGLAF4Qw0f7A';
const mlUrl = 'https://api.mercadolibre.com/orders/search?seller=766642543';

const addOrder = async (resource) => {
  try {
    let access_token = await token();
    //let orderId = await axios.get(mlUrl, { headers: {'Authorization': `Bearer ${access_token}`}})
    const orderURL = `https://api.mercadolibre.com/orders/${resource}`
    let order = await axios.get(orderURL,{ headers: {'Authorization': `Bearer ${access_token}`}})
    let shippingURL = `https://api.mercadolibre.com/shipments/${order.data.shipping.id}`
    let shipping = await axios.get(shippingURL, { headers: {'Authorization': `Bearer ${access_token}`}})
    let citye = shipping.data.receiver_address.city.name;
    let cityFinal = shipping.data.receiver_address.city.name;
    let state = shipping.data.receiver_address.state.name;
    let stateFinal = shipping.data.receiver_address.state.name;

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
    const customerPo = `ML_${id}`;
    const address = shipping.data.receiver_address.address_line;
    const shipTo = address.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const fName = order.data.buyer.first_name;
    const firstName = fName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const sName = order.data.buyer.last_name;
    const lastName = sName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const name1 = `${firstName} ${lastName}`
    //const phoneNumber = order.data.buyer.phone.number === undefined ? null : order.data.buyer.phone.number;
    const phoneNumber = shipping.data.receiver_address.receiver_phone
    const zipCode = shipping.data.receiver_address.zip_code;
    const sku = order.data.order_items[0].item.seller_sku;
    const quantity = order.data.order_items[0].quantity;  
    
    let addressline1 = '';
    let addressline2 = '';

    if(shipTo.length > 35){
      addressline1 = shipTo.slice(0, 35);
      addressline2 = shipTo.slice(36, shipTo.length);
    } else {
      addressline1 = shipTo
      addressline2 = '';
    }

let ingramToken = await axios.post(tokenUrl, postFields, header)
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

let responseFromIngram = await axios.post(baseUrl, data, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ingramToken.data.access_token}`,
  }, 
});

console.log(responseFromIngram.data.serviceresponse.ordersummary.customerponumber);
console.log(responseFromIngram.data.serviceresponse.ordersummary.ordercreateresponse[0]);
// console.log(data.ordercreaterequest.ordercreatedetails.shiptoaddress);
// console.log(data.ordercreaterequest.ordercreatedetails.lines[0]);
// console.log('access token: ', ingramToken.data.access_token);
  } catch (error) {
    console.log(error.response.data);
  }
}

addOrder('4836312584');