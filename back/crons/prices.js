const {getPrices} = require('../src/services/mercadolibre/stockService')

getPrices().then(() => console.log('updated'))