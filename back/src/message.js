// @ts-nocheck
const { default: axios } = require('axios');
const { token } = require('./tokens/ml');
const messageUrl = 'https://api.mercadolibre.com/messages/';

const sendMessage = async (resource) => {
  try {
    const ordersUrl = `https://api.mercadolibre.com/orders/${resource}`;
    const access_token = await token();
    const res = await axios.get(ordersUrl, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    // console.log(res.data)

    if (res.data.pack_id === null) {
      let orderId = res.data.id;
      let messageData = {
        from: {
          user_id: '766642543'
        },
        to: {
          user_id: `${res.data.buyer.id}`
        },
        text: `¡Hola, gracias por tu compra! Necesitamos tu ayuda para verificar que la información de tu perfil esté actualizada, verifica que estén correctos los  datos en el detalle de tu compra:
        -  Nombre completo
        -  Dirección completa
        -  Número de celular
        -  DNI, ¿Requieres factura? Compártenos tus datos fiscales.
        Atención L a V de 9am a 6pm`
      };
      let messUrl = `https://api.mercadolibre.com/messages/packs/${resource}/sellers/766642543?tag=post_sale`;
      let messageResponse = await axios.post(messUrl, messageData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'content-type': 'application/json',
        },
      });
      console.log('enviado con éxito');
      console.log(messageResponse.data)
      return true;
    } else {
      let orderId = res.data.pack_id;
      let messageData = {
        from: {
          user_id: '766642543'
        },
        to: {
          user_id: `${res.data.buyer.id}`
        },
        text: `¡Hola, gracias por tu compra! Necesitamos tu ayuda para verificar que la información de tu perfil esté actualizada, verifica que estén correctos los  datos en el detalle de tu compra:
        -  Nombre completo
        -  Dirección completa
        -  Número de celular
        -  DNI, ¿Requieres factura? Compártenos tus datos fiscales.
        Atención L a V de 9am a 6pm`,
      };
      
      let messUrl = `https://api.mercadolibre.com/messages/packs/${orderId}/sellers/766642543?tag=post_sale`;
      let messageResponse = await axios.post(messUrl, messageData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'content-type': 'application/json',
        },
      });
      console.log(messageResponse.data);
      console.log('enviado con éxito');
      return true;
    }
  } catch (error) {
    console.log(error.response.data);
    // return false;
  }
};

module.exports = {
  sendMessage,
};
