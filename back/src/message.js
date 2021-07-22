const axios = require('axios');
// const { findOrder, closeDB } = require('./db');
const { token } = require('./ml');
const messageUrl = 'https://api.mercadolibre.com/messages/';
const ordersUrl = 'https://api.mercadolibre.com';

const sendMessage = async resource => {
  try {
    const access_token = await token();
    const res = await axios.get(`${ordersUrl}${resource}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (res.data.pack_id === null) {
      let messageData = {
        from: {
          user_id: '766642543',
        },
        to: {
          user_id: `${res.data.buyer.id}`,
        },
        text: `¡Hola, gracias por tu compra! Para agilizar tu envio necesitamos tu ayuda con los siguientes datos:
        -  Nombre completo
        -  Dirección
        -  Número de celular
        -  DNI
        -  ¿Requieres factura? Compártenos tus datos fiscales.
        
        Con gusto te atendemos de Lunes a Viernes de 9am a 6pm, cualquier duda, estamos para ayudarte. ¡Disfruta tu producto!`,
      };
      let orderId = res.data.id;
      let messUrl = `https://api.mercadolibre.com/messages/packs/${orderId}/sellers/766642543`;
      let messageResponse = await axios.post(messUrl, messageData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'content-type': 'application/json',
        },
      });
      console.log('enviado con éxito');
      return messageResponse;
    } else {
      let messageData = {
        from: {
          user_id: '766642543',
        },
        to: {
          user_id: `${res.data.buyer.id}`,
        },
        text: `¡Hola, gracias por tu compra! Para agilizar tu envio necesitamos tu ayuda con los siguientes datos:
          -  Nombre completo
          -  Dirección
          -  Número de celular
          -  DNI
          -  ¿Requieres factura? Compártenos tus datos fiscales.
          
          Con gusto te atendemos de Lunes a Viernes de 9am a 6pm, cualquier duda, estamos para ayudarte. ¡Disfruta tu producto!`,
      };
      let orderId = res.data.pack_id;
      let messUrl = `https://api.mercadolibre.com/messages/packs/${orderId}/sellers/766642543`;
      let messageResponse = await axios.post(messUrl, messageData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'cache-control': 'no-cache',
          'content-type': 'application/json',
        },
      });
      console.log(messageResponse.data);
      console.log('enviado con éxito');
      return messageResponse.data;
    }
  } catch (error) {
    console.log(error.data);
    return;
  }
};

module.exports = {
  sendMessage,
};
