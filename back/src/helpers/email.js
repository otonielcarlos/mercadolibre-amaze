const nodemailer = require('nodemailer');

const sendRequest = async (body) => {
  // Configura el transporte SMTP
  const transporter = nodemailer.createTransport({
    host: 'mail.bluediamondinnovation.com',
    port: 465,
    secure: true, // true para puerto 465, false para otros puertos
    auth: {
      user: 'tom@bluediamondinnovation.com',
      pass: 'eComm@2020',
    },
  });

  // Configura los detalles del correo electrónico
  const mailOptions = {
    from: 'tom@bluediamondinnovation.com',
    to: 'tom@bluediamondinnovation.com',
    subject: 'Nuevo request recibido',
    text: `Request body: \n\n${JSON.stringify(body, null, 2)}`,
  };

  // Envía el correo electrónico
  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

module.exports = sendRequest;
