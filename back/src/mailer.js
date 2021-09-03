const nodemailer = require('nodemailer')
const sendMail = async (id, orderResponse) => {
    try {
         // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.bluediamondinnovation.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'marketplaces@bluediamondinnovation.com', // generated ethereal user
      pass: '6B+7~8?u_Oqa', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Apple Peru Mercadolibre" <marketplaces@bluediamondinnovation.com>', // sender address
    to: "carlos@bluediamondinnovation.com, eva@bluediamondinnovation.com, diego@bluediamondinnovation.com", // list of receivers
    subject: "Orden No Enviada A Ingram", // Subject line
    text: "Se ha encontrado un error en la última orden", // plain text body
    html: ` <h3>Favor de Introducir Manualmente</h3>
    <p>Orden ${id}</p>
    <p>Link <a href="https://www.mercadolibre.com.pe/ventas/listado?actions&encryptSelect&filters=&page=1&search=${id}&sort=DATE_CLOSED_DESC">Orden en Mercadolibre</a>
    <h4>Error en Ingram: </h4>
    <pre>${orderResponse} </pre>`
    , // html body
  });

return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

module.exports = {
    sendMail
}