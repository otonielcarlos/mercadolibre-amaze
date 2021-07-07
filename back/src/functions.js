const { skus, items } = require('./skus');
const axios = require('axios');
const arrayChunk = require('array-chunk');
const { db } = require('./db');
const { token } = require('./ml');
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
const updatePrice = () => {
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
              let query = `UPDATE appleml SET stock = '${data[i].stock}' WHERE sku = '${data[i].sku}'`;
              db.query(query, (err, results) => {
                if (err) console.log(err.message);
                console.log(`updating... ${data[i].sku} ${data[i].stock}`);
              });
            }
          });
          // db.end();
        });
    })
    .catch(error => {
      console.log('Error en price', error.response.data);
      throw error;
    });
}

const setStock = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    db.query('SELECT * FROM appleml', (err, results) => {
      if (err) reject(err);
      const newp = results.map(prod => prod);
      resolve(newp);
    });
  });
}

const afterSetStock = response => {
  db.end();
  const accessToken = token();
  return Promise.all([response, accessToken])
.then(async res => {
  
  Promise.all(
    res[0].map(item => {
      
      return axios.put(
        `https://api.mercadolibre.com/items/${item.itemid}`,
        {
          variations: [
            {
              id: item.variationid,
              available_quantity: item.stock,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${res[1]}`,
          },
        }
      );
    })
    )
    .then(values => {
      values.forEach(value => {
        console.log(value.data.id, value.data.available_quantity);
      });
      const timeElapsed = Date.now();
const today = new Date(timeElapsed);
console.log(today.toDateString());
    })
    .catch(err => console.log(err.response.data));
})
}

updatePrice().then(() => {
  setStock()
  .then(response => {
    afterSetStock(response); 
  })
})
.catch(err => console.log(err));