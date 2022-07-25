

const skusChunks = (skus) => {
   return skus.reduce((resultArray, item, index) => { 
  const chunkIndex = Math.floor(index/50)
  if(!resultArray[chunkIndex]) {
    resultArray[chunkIndex] = [] // start a new chunk
  }
  
  resultArray[chunkIndex].push({"ingramPartNumber" : item})
  return resultArray
}, [])}

module.exports = {
  skusChunks
}