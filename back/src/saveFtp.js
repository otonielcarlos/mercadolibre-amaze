const ftp = require('basic-ftp');

async function savePdfToServer(name) {
  const client = new ftp.Client();
  // client.ftp.verbose = true;
  try {
    await client.access({
      host: '173.231.198.187',
      // host: 'https://amaze.com.pe',
      user: 'amazecom',
      password: '6vB2YVxW5=%r',
      secure: false,
      timeout: 50000,
    });
    // await client.access({
    //   // host: '173.231.198.187',
    //   host: 'amaze.com.pe',
    //   user: 'amazecom',
    //   password: '6vB2YVxW5=%r',
    //   secure: 'implicit',
    //   timeout: 50000,
    // });
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
