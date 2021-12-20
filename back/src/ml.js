const axios = require('axios');
const log = console.log;
const body = {
  grant_type: 'refresh_token',
  client_id: '2796079999742920',
  client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
  refresh_token: 'TG-61b77106eae786001b26a457-766642543',
};
const body_1 = {
  grant_type: 'authorization_code',
  client_id: '2796079999742920',
  client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
  code: 'TG-61b770c171f899001bb1ee77-766642543',
  redirect_uri: 'https://appleamaze.herokuapp.com/',
};

const token = () => {
  return axios
    .post('https://api.mercadolibre.com/oauth/token', body, {
      headers: {
        Accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
    .then(res => res.data.access_token)
    .catch(err => console.log(err));
};

token();
module.exports = {
  token,
};
