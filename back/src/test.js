const axios = require('axios');
const { token } = require('./ml');


const newToken = token();

Promise.resolve(newToken)
// .then(token => {
//     console.log(token);
//    return axios
//   .put(
//     `https://api.mercadolibre.com/items/MPE445933110`,
//     {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     {
//       variations: [
//         {
//           id: 86575092912,
//           available_quantity: 17,
//         },
//       ],
//     }
//   )
//   .then(res => console.log(res))
//   .catch(err => {
//     console.log(err.response.data);
//   });
// })
// .catch(err => console.log(err.response.data))

.then(token => {
    return axios.get('https://api.mercadolibre.com/applications/2796079999742920/grants', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => console.log(res.data.grants[0]));

})