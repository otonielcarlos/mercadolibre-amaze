const ftp = require('basic-ftp');

async function savePdfToServer(name) {
  const client = new ftp.Client();
  // client.ftp.verbose = true
  try {
    await client.access({
      host: '173.231.198.187',
      user: 'amazecom',
      password: '6vB2YVxW5=%r',
      secure: false,
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