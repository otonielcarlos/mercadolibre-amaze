const axios = require('axios');
const moment = require('moment-timezone');

const SELLER_ID = 'your_seller_id';
const ACCESS_TOKEN = 'your_access_token';

// Establece la zona horaria
const timezone = 'America/Lima';

// Obtiene la fecha y hora actual
const now = moment().tz(timezone);

// Calcula la fecha y hora de ayer después de la 1 PM
const yesterdayAfter1PM = now.clone().subtract(1, 'days').hour(13).minute(0).second(0);

// Calcula la fecha y hora de hoy antes de la 1 PM
const todayBefore1PM = now.clone().hour(13).minute(0).second(0);

// Convierte las fechas a formato UNIX timestamp (en milisegundos)
const dateFrom = yesterdayAfter1PM.format('X') * 1000;
const dateTo = todayBefore1PM.format('X') * 1000;

//const url = `https://api.mercadolibre.com/orders/search?seller=${SELLER_ID}&access_token=${ACCESS_TOKEN}&date_created_from=${dateFrom}&date_created_to=${dateTo}`;
const url = `https://api.mercadolibre.com/orders/search?seller=766642543&access_token=APP_USR-2796079999742920-031613-b2aba6183c4f29d8348c6e99168a107e-766642543&date_created_from=${dateFrom}&date_created_to=${dateTo}`;
(async () => {
  try {
    const response = await axios.get(url);
    const orders = response.data.results;

    // Filtra las órdenes que no tienen la etiqueta "delivered"
    const filteredOrders = orders.filter(order => !order.tags.includes('delivered'));

    console.log(filteredOrders);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error.message);
  }
})();
