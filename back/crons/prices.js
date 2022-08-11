const {getPrices} = require('../src/services/stockService')

getPrices().then(() => console.log('updated'))