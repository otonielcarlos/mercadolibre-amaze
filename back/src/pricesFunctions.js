const { token } = require('./tokens/ml');
const { ingramToken } = require('./tokens/ingramToken')
const { getAllSkus, updateStock, updatePrevStock, getAllVariations, getAllNoVariations } = require('./db');
const { skusChunks } = require('./helpers/chunks')
const { requestAPI } = require('./helpers/requests')
const { joinItems } = require('./helpers/requestForML');
const { putStock } = require('./helpers/postRequest')
const log = console.log;

const getPrices = async () => {
  try{
    await updatePrevStock();
    let skus = await getAllSkus();
    let skusForAPI = skusChunks(skus);
    let responseFromIngram = await requestAPI(skusForAPI)
    await updateStock(responseFromIngram);
    let getVariations = await getAllVariations();
    let variations = joinItems(getVariations);
    let items = await getAllNoVariations();
    await putStock(variations);
    await putStock(items);

  } catch(err){
    log(err)
  }
    
}

getPrices();