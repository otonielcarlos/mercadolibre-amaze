const axios = require('axios');
const { db } = require('./db');
const { items } = require('./skus');
const body = {
  grant_type: 'refresh_token',
  client_id: '2796079999742920',
  client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
  refresh_token: '',
};
// const body = {
//   grant_type: 'authorization_code',
//   client_id: '2796079999742920',
//   client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
//   code: 'TG-60c39fb7a490550007848587-766642543',
//   redirect_uri: 'https://appleamaze.herokuapp.com/',
// };

function token() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM token', (err, results) => {
      if (err) reject(err);
      body.refresh_token = results[0].refresh_token;
      resolve(body);
    });
  })
    .then(response => {
      console.log('response: ', response);
      return axios
        .post('https://api.mercadolibre.com/oauth/token', response, {
          headers: {
            Accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
          },
        })
        .then(res => {
          db.query(
            `UPDATE token SET access_token = '${res.data.access_token}'`,
            (err, results) => {
              console.log('updating access token ' + res.data.access_token);
            }
          );
          db.query(
            `UPDATE token SET refresh_token = '${res.data.refresh_token}'`,
            (err, results) => {
              console.log('updating refresh token ' + res.data.refresh_token);
            }
          );
        })
        .then(() => {
          db.end();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err.response));
}


token();
module.exports.token = token
// module.exports.token = token