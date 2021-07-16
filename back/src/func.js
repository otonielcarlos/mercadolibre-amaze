const axios = require('axios');
const arrayChunk = require('array-chunk');
const { findOrder } = require('./db');
const { token } = require('./ml');
const { response } = require('express');
let i = 0;
let itemsChunk = [];
const baseUrl =
  'https://api.ingrammicro.com:443/resellers/v5/catalog/priceandavailability';

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
    const id = order.data.id;
    const NV = `ML_${id}`;

    const address = shipping.data.receiver_address.address_line;
    const shipTo = address.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    const fName = order.data.buyer.first_name;
    const firstName = fName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const sName = order.data.buyer.last_name;
    const lastName = sName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    const phoneNumber = order.data.buyer.phone.number;
    const zipCode = shipping.data.receiver_address.zip_code;
    const sku = order.data.order_items[0].item.seller_sku;
    let city = shipping.data.receiver_address.city.name;

    switch (city) {
      case 'Amazonas': city = "01"; break;
      case 'Ancash': city = "02"; break;
      case 'Apurimac': city = "03"; break;
      case 'Arequipa': city = "04"; break;
      case 'Ayacucho': city = "05"; break;
      case 'Cajamarca': city = "06"; break;
      case 'Callao': city = "07"; break;
      case 'Cusco': city = "08"; break;
      case 'Huancavelica': city = "09"; break;
      case 'Huanuco': city = "10"; break;
      case 'Ica': city = "11"; break;
      case 'Junin': city = "12"; break;
      case 'La Libertad': city = "13"; break;
      case 'Lambayeque': city = "14"; break;
      case 'Lima': city = "15"; break;
      case 'Loreto': city = "16"; break;
      case 'Madre de Dios': city = "17"; break;
      case 'Moquegua': city = "18"; break;
      case 'Pasco': city = "19"; break;
      case 'Piura': city = "20"; break;
      case 'Puno': city = "21"; break;
      case 'San Martin': city = "22"; break;
      case 'Tacna': city = "23"; break;
      case 'Tumbes': city = "24"; break;
      case 'Ucayali': city = "25"; break;
    }

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

  console.log('customerpo: ', NV);
  console.log('name1:', firstName.concat(" ", lastName));
  console.log('phonenumber: ', phoneNumber);
  console.log('addressline1:', addressline1)
  console.log('addressline2:', addressline2)
  console.log('ZIP:', zipCode)
  console.log('City:', city)
  console.log('sku', sku);
} else {
  console.log( orderIdentifier,'ya está en base de datos')
}

    
  } catch (error) {
    console.log(error);
  }
}

getOrders();