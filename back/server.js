const express = require('express');
const app = express();
const { updatePrice, setStock, afterSetStock } = require('./src/functions');
// const token = require('./src/ml').token

const PORT = process.env.PORT || 4000;


updatePrice().then(() => {
    setStock()
    .then(response => {
      afterSetStock(response); 
    })
  })
  .catch(err => console.log(err));

// app.listen(PORT, err => {
//   if (err) console.log(err);
//   console.log(`listening on port: ${PORT}`);
// });
