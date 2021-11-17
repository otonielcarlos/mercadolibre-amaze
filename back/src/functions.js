const { skus, items } = require('./skus');
const axios = require('axios');
const arrayChunk = require('array-chunk');
const { db } = require('./db');
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
const skuChunks = arrayChunk(skus, 50);

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
          let query= '';
            for (let i in data) {
              
              query += `UPDATE appleml SET stock = '${data[i].stock}' WHERE sku = '${data[i].sku}'; `;
            
            }
            db.query(query, (err, results) => {
              if (err) console.log(err.message);
              console.log('actualizado');
            });
        });
    })
    .catch(error => {
      console.log('Error en price', error);
      throw error;
    });
};
// updatePrice();
const setStockWithVariationId = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    db.query(
      'SELECT * FROM appleml WHERE itemid IS NOT NULL AND variationid IS NOT NULL',
      (err, results) => {
        if (err) reject(err);
        const newp = results.map(prod => prod);
        resolve(newp);
      }
    );
  });
};


const afterSetStockVariation = response => {

  const accessToken = token();
  return Promise.all([response, accessToken])
    .then(res => {
      let respromises = [];
          let p = 0;
        for(let i in res[0]){ 
          p++;
          setTimeout(async () => {
             try{
              const result = await axios.put(`https://api.mercadolibre.com/items/${res[0][i].itemid}`, {variations: [{id: res[0][i].variationid, available_quantity: res[0][i].stock,},],},
              {headers: {'Content-Type': 'application/json',Authorization: `Bearer ${res[1]}`,},})
              respromises.push(result.data)
              console.log(i,'success variation:' ,result.data.id ,'status: '+result.status);
               }catch(err){
                 console.log(i, 'failed variation', res[0][i].itemid, err.response.data.message)}
                }, 1000 * i)
            }
          return respromises;
  })
    .then(values => {
      let d = new Date();
      let n = d.getHours();
      let m = d.getMinutes();
      console.log(`updated variations ${n}:${m}`)
    })
    .catch(err => console.log(err))

};

const setStockWithItemId = () => {
  return new Promise((resolve, reject) => {
    const result = [];
    db.query(
      'SELECT * FROM appleml WHERE itemid IS NOT NULL AND variationid IS NULL',
      (err, results) => {
        if (err) reject(err);
        const newp = results.map(prod => prod);
        resolve(newp);
      }
    );
  });
};


const afterSetStockItem = response => {
  const accessToken = token();
  return Promise.all([response, accessToken])
    .then(res => {
      
      let chunksOfProducts =  arrayChunk(res[0],60);
      let respromises = [];
      let p = 0;
      for(let i in res[0]){ 
        p++;
        setTimeout(async () => {
           try{
            const result = await axios.put(`https://api.mercadolibre.com/items/${res[0][i].itemid}`, {available_quantity: res[0][i].stock},
            {headers: {'Content-Type': 'application/json',Authorization: `Bearer ${res[1]}`,},})
            respromises.push(result.data)
            console.log(i,'success item:' ,result.data.id ,'status: ' + result.status);
             }catch(err){
               console.log(i, 'failed item: ',res[0][i].itemid,err.response.data.message)}
              }, 1000 * i)
          }
        return respromises;
  })
    .then(values => {
      let d = new Date();
      let n = d.getHours();
      let m = d.getMinutes();
      console.log(`updated variations ${n}:${m}`)
    })
    .catch(err => console.log(err.data))

};

updatePrice().then(async () => {
 try
  {
    const response = await setStockWithVariationId();
    afterSetStockVariation(response);
    const response_2 = await setStockWithItemId();
    afterSetStockItem(response_2);
    // return db.end();
  } catch (err)
  {
    return console.log(err);
  }
})
.catch(err => console.log(err));