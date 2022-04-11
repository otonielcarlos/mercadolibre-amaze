const { default: axios } = require('axios');

const tokenUrl = 'https://api.ingrammicro.com:443/oauth/oauth30/token';
const postFields = 'grant_type=client_credentials&client_id=peCS1OtW2QSK8iCAm52bcE6Wl5R8oRci&client_secret=qk4KtGLAF4Qw0f7A';
const headers = {
    headers: {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
    },
  }

const ingramToken = async () => {
  // @ts-ignore
  const request = await axios.post(tokenUrl, postFields, headers);
  const token = request.data.access_token;
  return token;
}

module.exports = {
  ingramToken
}