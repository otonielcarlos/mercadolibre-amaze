const axios = require('axios');
const arrayChunk = require('array-chunk');
const { findOrder } = require('./db');
const { token } = require('./ml');
// const { response } = require('express');
let i = 0;
let itemsChunk = [];
const baseUrl =
  'https://api.ingrammicro.com:443/resellers/v5';

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const tokenUrl = 'https://api.ingrammicro.com:443/oauth/oauth30/token';
const postFields =
  'grant_type=client_credentials&client_id=peCS1OtW2QSK8iCAm52bcE6Wl5R8oRci&client_secret=qk4KtGLAF4Qw0f7A';
const mlUrl = 'https://api.mercadolibre.com/orders/search?seller=766642543';

async function getOrders() {
  try {
    let access_token = await token();
    let orderId = await axios.get(mlUrl, { headers: {'Authorization': `Bearer ${access_token}`}})
    const orderURL = `https://api.mercadolibre.com/orders/${orderId.data.results[0].payments[0].order_id}`
    let order = await axios.get(orderURL,{ headers: {'Authorization': `Bearer ${access_token}`}})
    let shippingURL = `https://api.mercadolibre.com/shipments/${order.data.shipping.id}`
    let shipping = await axios.get(shippingURL, { headers: {'Authorization': `Bearer ${access_token}`}})
    let state = shipping.data.receiver_address.city.name;
    switch (state) {
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
    }
    const id = order.data.id;
    const customerPo = `ML_${id}`;
    const address = shipping.data.receiver_address.address_line;
    const shipTo = address.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    const fName = order.data.buyer.first_name;
    const firstName = fName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const sName = order.data.buyer.last_name;
    const lastName = sName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const phoneNumber = order.data.buyer.phone.number;
    const zipCode = shipping.data.receiver_address.zip_code;
    const sku = order.data.order_items[0].item.seller_sku;
    
    let addressline1 = '';
    let addressline2 = '';

    if(shipTo.length > 35){
      addressline1 = shipTo.slice(0, 35);
      addressline2 = shipTo.slice(36, shipTo.length);
    } else {
      addressline1 = shipTo
      addressline2 = '';
    }

let orderIdentifier = await findOrder(id);

if(orderIdentifier === undefined){

  let data = {
    "ordercreaterequest": {
      "requestpreamble": {
        "isocountrycode": "PE",
        "customernumber": "325831"
      },
      "ordercreatedetails": {
        "customerponumber": `"${customerPo}"`,
        "shiptoaddress": {
          "name1": `"${name1}"`,
          "addressline1": `"${addressline1}"`,
          "addressline2": `"${addressline2}"`,
          "city": "Long Beach",
          "state": `"${state}"`,
          "postalcode": `"${zipCode}"`,
          "countrycode": "PE"
        },
        "carriercode": "E1",
        "lines": [
          {
            "linetype": "P",
            "linenumber": "001",
            "quantity": "1",
            "ingrampartnumber": `"${sku}"`
          }
        ]
      }
    }
}

  let ingramToken = await axios.post(tokenUrl, postFields, header)
  let responseFromIngram = await axios.post(baseUrl, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ingramToken}`,
    },
  }); 

  console.log('customerpo: ', customerPo);
  console.log('name1:', firstName.concat(" ", lastName));
  console.log('phonenumber: ', phoneNumber);
  console.log('addressline1:', addressline1)
  console.log('addressline2:', addressline2)
  console.log('ZIP:', zipCode)
  console.log('State:', state)
  console.log('sku', sku);
} else {
  console.log( orderIdentifier,'ya está en base de datos')
}
  } catch (error) {
    console.log(error);
  }
}

getOrders();