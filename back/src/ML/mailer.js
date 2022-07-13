require('dotenv').config()
const {MAIL_USER, MAIL_PASSWORD, MAIL_RECEIVERS, MAIL_FROM} = process.env


const nodemailer = require('nodemailer')
const sendMail = async (id) => {
    try {
         // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.bluediamondinnovation.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: MAIL_USER, // generated ethereal user
      pass: MAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: MAIL_FROM, // sender address
    to: MAIL_RECEIVERS, // list of receivers
    subject: "Orden No Enviada A Ingram", // Subject line
    text: "Se ha encontrado un error en la última orden", // plain text body
    html: ` <h3>Favor de Introducir Manualmente</h3>
    <p>Orden ${id}</p>
    <p>Link <a href="https://www.mercadolibre.com.pe/ventas/listado?actions&encryptSelect&filters=&page=1&search=${id}&sort=DATE_CLOSED_DESC">Orden en Mercadolibre</a>`
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