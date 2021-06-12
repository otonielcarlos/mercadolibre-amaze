const { skus, items } = require('./skus');
const axios = require('axios');
const arrayChunk = require('array-chunk');
const { db } = require('./db');
let stockResults = [];
let i = 0;
const baseUrl =
  'https://api.ingrammicro.com:443/resellers/v5/catalog/priceandavailability';

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const tokenUrl = 'https://api.ingrammicro.com:443/oauth/oauth30/token';
const postFields =
  'grant_type=client_credentials&client_id=peCS1OtW2QSK8iCAm52bcE6Wl5R8oRci&client_secret=qk4KtGLAF4Qw0f7A';
const skuChunks = arrayChunk(skus, 50);

//GET STOCK

// Get PNA Function
function updatePrice() {
  return axios
    .post(tokenUrl, postFields, header)
    .then(response => response.data.access_token)
    .then(token => {
      return Promise.all(
        skuChunks.map(chunk => {
          let requestObject = {
            servicerequest: {
              requestpreamble: {
                customernumber: '325831',
                isocountrycode: 'PE',
              },
              priceandstockrequest: {
                showwarehouseavailability: 'True',
                extravailabilityflag: 'Y',
                item: chunk,
                includeallsystems: false,
              },
            },
          };
          return axios.post(baseUrl, requestObject, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        })
      )
        .then(res => {
          let array = [];
          res.forEach(prod =>
            prod.data.serviceresponse.priceandstockresponse.details.forEach(
              sku => {
                array.push({
                  sku: sku.ingrampartnumber,
                  stock: sku.warehousedetails[0].availablequantity,
                });
              }
            )
          );
          return array;
        })
        .then(data => {
          // console.log(data);
          db.connect(err => {
            if (err) console.log(err);

            for (let i in data) {
              let query = `UPDATE appleml SET stock = ${data[i].stock} WHERE sku = ${data[i].sku}`;
              db.query(query, (err, results) => {
                if (err) console.log(err.message);
                console.log('updating...');
              });
            }
          });
          db.end();
        });
    })
    .catch(error => {
      console.log('Error en price', error);
      throw error;
    });
}

function setStock() {
  return new Promise((resolve, reject) => {
    const result = [];
    db.query('SELECT * FROM appleml', (err, results) => {
      if (err) reject(err);
      const newp = results.map(prod => prod);
      resolve(newp);
    });
  });
}
// updatePrice();
setStock()
  .then(response => {
    const token = new Promise((resolve, reject) => {
      db.query('SELECT access_token FROM token', (err, results) => {
        if (err) reject(err);
        resolve(results[0].access_token);
      });
    });

    return Promise.all([response, token])
  })
    .then(res => {
      console.log(res[0].length)
      console.log(res[1].length)
        db.end();
           Promise.all(res[0].map(item => {
          return  axios.put(`https://api.mercadolibre.com/items/${item.itemid}`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${res[1]}`
           },{
             "variations": [{
               "id" : `${item.variationid}`,
               "available_quantity": `${item.stock}`
             }]
           })
           
         }))
         .then(values => console.log(values))
         .catch(err => console.log(err.response.data));
  })
  
  .catch(err => console.log(err));
  
