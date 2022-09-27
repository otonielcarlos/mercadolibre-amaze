const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')
const {updateTrackingNumberAndStatus} = require('../../services/asus/updateTracking')
require('dotenv').config()
const {BEETRACK_AMAZE_CONTACT_ID} = process.env


async function getDelivery(req, res) {
  try {

    const {dispatch_guide, tags} = req.body

    if(dispatch_guide.contact_identifier === BEETRACK_AMAZE_CONTACT_ID){
      console.log(req.body)
      const isAsus = tags.find(tag => tag.name === "OC").value
      const OC = isAsus.split('_')[0]
      if(OC === "ESHOPASUS"){
        const delivery = tags.find(tag => tag.name === "Delivery").value
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        await updateTrackingNumberAndStatus({delivery, ingramOrder})
        res.status(200).send()
      } else{
        res.status(200).send()
      }
    } else{
      res.status(200).send()
    }
    
  } catch (error) {
    console.log('error en getDelivery Controller', error)
  }
}


module.exports = {
  getDelivery
}


// let ex = {
//   "resource": "dispatch_guide",
//   "event": "create",
//   "account_name": "Ingram Micro Peru",
//   "dispatch_guide": {
//     "guide": "019-0004745",
//     "beecode": "c0c5038afef4f0c6a2d10abb",
//     "identifier": "019-0004745",
//     "account_id": 2572,
//     "promised_date": null,
//     "contact_name": "AMAZE PERU E.I.R.L.",
//     "contact_phone": "968145213",
//     "contact_identifier": "20606185775",
//     "contact_email": null,
//     "contact_address": "AV 28 DE JULIO 1583 CERCADO DE LIMA, , CERCADO DE LIMA, LIMA"
//   },
//   "tags": [
//     {
//       "name": "Contacto",
//       "value": "Cliente"
//     },
//     {
//       "name": "Delivery",
//       "value": "8091253587"
//     },
//     {
//       "name": "Factura Sap",
//       "value": "9921542308"
//     },
//     {
//       "name": "Factura Sunat",
//       "value": "01_F007_0391546"
//     },
//     {
//       "name": "Nota de venta",
//       "value": "7092260067"
//     },
//     {
//       "name": "OC",
//       "value": "ESHOPASUS_7000004392"
//     }
//   ],
//   "items": [
//     {
//       "id": 680870352,
//       "name": "E510MA-BR883WS CEL N4020 128GB 4GB WIN11",
//       "description": "E510MA-BR883WS CEL N4020 128GB 4GB WIN11",
//       "quantity": 6,
//       "original_quantity": 6,
//       "delivered_quantity": 0,
//       "code": "5447139",
//       "extras": []
//     }
//   ],
//   "groups": []
// }