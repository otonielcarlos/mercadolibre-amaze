const axios = require('axios');
const body = {
  grant_type: 'refresh_token',
  client_id: '2796079999742920',
  client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
  refresh_token: 'TG-60c57d748430ea00073c61f4-766642543',
};
const body_1 = {
  grant_type: 'authorization_code',
  client_id: '2796079999742920',
  client_secret: 'iVV5i9dJyklUQoFwgxP83H8EqdmdZhFN',
  code: 'TG-60c57d65e7c3ac00075d768b-766642543',
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

// token();
module.exports = {
  token,
};
