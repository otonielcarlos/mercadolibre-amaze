const express = require('express');
const app = express();
// const { getPrice } = require('./src/functions');
// const token = require('./src/ml').token

const PORT = process.env.PORT || 4000;

// console.log(token)

// token();
app.listen(PORT, err => {
  if (err) console.log(err);
  console.log(`listening on port: ${PORT}`);
});
