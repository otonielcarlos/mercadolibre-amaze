
const axios = require('axios');
const arrayChunk = require('array-chunk');

// const arrayofskus = arrayChunk(allskus, 50);
// console.log(arrayofskus)
const baseUrl =
  'https://api.ingrammicro.com:443/resellers/v5/catalog/priceandavailability';

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
};
const tokenUrl = 'https://api.ingrammicro.com:443/oauth/oauth30/token';
const postFields =
  'grant_type=client_credentials&client_id=peCS1OtW2QSK8iCAm52bcE6Wl5R8oRci&client_secret=qk4KtGLAF4Qw0f7A';

const updatePrice = async () => {
     Promise.all(
      arrayofskus.map( async (chunk) => {
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
         return await axios.post(baseUrl, requestObject, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer keDebl2hd31n0A1CzWF46JfmEG8A`,
          },
        });
      })
    ).then(res =>{
    // console.log(res);
    res.forEach(prod => {
        // console.log(prod);
      prod.data.serviceresponse.priceandstockresponse.details.forEach(sku => {
        console.log(sku.ingrampartnumber, sku.vendorpartnumber);
      })}
    );})
    .catch(err => console.log(err.data));
};
const token = 'APP_USR-2796079999742920-092817-9d6b11d531dec8900c1141bf519207b8-766642543'
const allItems = ['MPE446600170',
'MPE446654020',
'MPE445990670',
'MPE446605201',
'MPE446728735',
'MPE445990495',
'MPE445990448',
'MPE446604968',
'MPE446604955',
'MPE447357677',
'MPE445991988',
'MPE446604955',
'MPE445979845',
'MPE446604955',
'MPE445990151',
'MPE445990123',
'MPE446654299',
'MPE445990192',
'MPE445990123',
'MPE445990218',
'MPE445990529',
'MPE445990448',
'MPE445990348',
'MPE445990218',
'MPE445933125',
'MPE446600246',
'MPE446647631',
'MPE445992192',
'MPE446604955',
'MPE445990448',
'MPE445933117',
'MPE445990279',
'MPE446589106',
'MPE445990279',
'MPE445933121',
'MPE445990279',
'MPE445933118',
'MPE445933112',
'MPE445933120',
'MPE447567465',
'MPE445933125',
'MPE446402806',
'MPE446600326',
'MPE445933125',
'MPE445933111',
'MPE445990448',
'MPE445990397',
'MPE445933112',
'MPE445933125',
'MPE446605089',
'MPE445898822',
'MPE445898801',
'MPE445898822',
'MPE445933116',
'MPE447567465',
'MPE445933124',
'MPE445990279',
'MPE445898811',
'MPE445898821',
'MPE445990310',
'MPE445990218',
'MPE446604858',
'MPE445898844',
'MPE445898831',
'MPE445898828',
'MPE445898816',
'MPE445898812',
'MPE446605121',
'MPE445898821',
'MPE445990123',
'MPE445898830',
'MPE445898814',
'MPE445898814',
'MPE446002639',
'MPE445933113',
'MPE447567465',
'MPE445898822',
'MPE445898802',
'MPE446599423',
'MPE446599268',
'MPE447362338',
'MPE445898816',
'MPE446002572',
'MPE445898814',
'MPE445898813',
'MPE446002587',
'MPE446647476',
'MPE55002790',
'MPE445898828',
'MPE445898824',
'MPE445898829',
'MPE445898816',
'MPE445898816',
'MPE445898798',
'MPE445933110',
'MPE445990279',
'MPE446600094',
'MPE447153623',
'MPE446588483',
'MPE446588472',
'MPE446588634',
'MPE445898816',
'MPE445898809',
'MPE55002795',
'MPE446588472',
'MPE446588458',
'MPE445959260',
'MPE447737398',
'MPE446599423',
'MPE446599342',
'MPE447362338',
'MPE447969794',
'MPE445898834',
'MPE445898828',
'MPE445898834',
'MPE445898818',
'MPE447189122',
'MPE445898834',
'MPE446588366',
'MPE445898821',
'MPE447861675',
'MPE445898828',
'MPE445898820',
'MPE448036399',
'MPE446588472',
'MPE445898834',
'MPE445898811',
'MPE446588472',
'MPE446588422',
'MPE445898821',
'MPE447969825',
'MPE446588472',
'MPE446588454',
'MPE445898811',
'MPE447153178',
'MPE447814935',
'MPE445898811',
'MPE447969772',
'MPE445898834',
'MPE447937599',
'MPE447815416',
'MPE446599423',
'MPE447362338',
'MPE447969447',
'MPE448040585',
'MPE445898823',
'MPE445898814',
'MPE445898811',]

const allmlskus= ['2918147',
'3075291',
'3553553',
'3578869',
'4312891',
'4348220',
'4461906',
'4461908',
'4487567',
'4641700',
'4681714',
'4682125',
'4682130',
'4831203',
'4831226',
'4831227',
'4833036',
'4878504',
'5026953',
'5026965',
'5026966',
'5026967',
'5026968',
'5026997',
'5026998',
'5027001',
'5027007',
'5027008',
'5027009',
'5027010',
'5027011',
'5027012',
'5027025',
'5027026',
'5027027',
'5027028',
'5027029',
'5027030',
'5027032',
'5027033',
'5027034',
'5027045',
'5027046',
'5027047',
'5027048',
'5027050',
'5044857',
'5046028',
'5046059',
'5046062',
'5046064',
'5046065',
'5046066',
'5046086',
'5046091',
'5046101',
'5046102',
'5046103',
'5046104',
'5046105',
'5046106',
'5046107',
'5046108',
'5046125',
'5046126',
'5046128',
'5046129',
'5046130',
'5046131',
'5046135',
'5063951',
'5063956',
'5114196',
'5114198',
'5114200',
'5196288',
'5196299',
'5196300',
'5231308',
'5231309',
'5231310',
'5231322',
'5231323',
'5231324',
'5231325',
'5231326',
'5232019',
'5046060',
'5046061',
'5046087',
'5046090',
'5046089',
'5046088',
'5046095',
'5046092',
'5046094',
'5046093',
'5198356',
'5198362',
'5198330',
'5198359',
'5198361',
'5198358',
'5196246',
'5195974',
'5195973']

// for (let i in allmlskus) {
//   axios.get(`https://api.mercadolibre.com/users/766642543/items/search?seller_sku=${allmlskus[i]}`, 
//   {headers: {Authorization: `Bearer ${token}`}})
  
//   .then(response => {
//     let res = response.data.results;
//     console.log(allmlskus[i] ,res);
  
//   })
// }
let data = {}
for (let i in allItems) {
  axios.get(`https://api.mercadolibre.com/items/${allItems[i]}`, {headers: {Authorization: `Bearer ${token}`}})
  .then(response => {
    let res = response.data.variations;
    if(res.length > 0){
    for (let i in res){ 
      // data.item = response.data.id
      // data.variation= res[i].id
    console.log(response.data.id, res[i].id )
    }
  }
  // console.log(data);
  })
  .catch(err => console.log(err))
}

