

async function getDeliveryUrbano(req, res) {
  try {
    console.log(req.body)
    res.status(200).send()
  } catch (error) {
    res.status(400).send()
  }
}

module.exports = {
  getDeliveryUrbano
}