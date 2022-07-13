// @ts-nocheck
const ftp = require('basic-ftp');
require('dotenv').config()
const {SERVER_HOST, SERVER_PASSWORD, SERVER_USER} = process.env

async function savePdfToServer(name) {
  const client = new ftp.Client();
  // client.ftp.verbose = true;
  try {
    await client.access({
      host: SERVER_HOST,
      user: SERVER_USER,
      password: SERVER_PASSWORD,
      secure: false,
      timeout: 50000,
    });
  
    await client.list();
    await client.uploadFrom(
      `back/src/etiqueta/${name}`,
      `public_html/appleml/${name}`
    );
  } catch (err) {
    console.log(err);
  }
  client.close();
}
module.exports = {
  savePdfToServer,
};
