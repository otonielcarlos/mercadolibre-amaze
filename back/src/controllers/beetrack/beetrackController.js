const { getAsusEntity } = require('../../database/asus/ordersDB')
const usePromise = require('../../helpers/errorHandling')
const ordersService = require('../../services/asus/ordersService')
const { statusUpdateAsus } = require('../../services/asus/statusUpdateAsus')
const {updateTrackingNumberAndStatus} = require('../../services/asus/updateTracking')
const { getTokenAsus } = require('../../tokens/magento')
require('dotenv').config()
const {BEETRACK_AMAZE_CONTACT_ID} = process.env


async function getDelivery(req, res) {
  try {

    const {dispatch_guide, tags} = req.body

    console.log(req.body)
    if(dispatch_guide.contact_identifier === BEETRACK_AMAZE_CONTACT_ID){
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

async function completeDelivery(req, res) {
  try {
    const {contact_identifier, status, tags} = req.body

    if(contact_identifier === BEETRACK_AMAZE_CONTACT_ID && status === 2){
      const isAsus = tags.find(tag => tag.name === "OC").value
      const OC = isAsus.split('_')[0]
      if(OC === "ESHOPASUS"){
        const ingramOrder = tags.find(tag => tag.name === "Nota de venta").value
        const order = await getAsusEntity(ingramOrder)
        await statusUpdateAsus({order: order[0].order_id, status: 'Done'})
        res.status(200).send()
      } else{
        res.status(200).send()
      }
    }
  } catch (error) {
    console.log(error, 'error in completeDelivery Asus')
  }
}


module.exports = {
  getDelivery,
  completeDelivery
}


let reqBody = {
  "resource": "dispatch",
  "event": "update",
  "account_name": "Ingram Micro Peru",
  "account_id": 2572,
  "guide": "018-0050742",
  "identifier": "018-0050742",
  "route_id": 28971684,
  "dispatch_id": 460732004,
  "truck_identifier": "ARZ743",
  "status": 2,
  "substatus": "Entrega Conforme",
  "substatus_code": "",
  "estimated_at": "2022-09-27T16:17:51.000-05:00",
  "max_delivery_time": null,
  "min_delivery_time": null,
  "is_pickup": false,
  "is_trunk": false,
  "locked": false,
  "contact_name": "CONTRERAS TORRES MARLENE ELODIA",
  "contact_phone": "954662800",
  "contact_identifier": "10222833634",
  "contact_email": "vipalxyz@gmail.com",
  "contact_address": "AV. BOLIVIA 148 INT. 285F CERDADO DE LIMA, LIMA, LIMA, LIMA",
  "tags": [
    {
      "name": "Contacto",
      "value": "Cliente"
    },
    {
      "name": "Delivery",
      "value": "8091577162"
    },
    {
      "name": "Factura Sap",
      "value": "9921579022"
    },
    {
      "name": "Factura Sunat",
      "value": "01_F007_0392571"
    },
    {
      "name": "Nota de venta",
      "value": "7092608933"
    },
    {
      "name": "OC",
      "value": "12345"
    }
  ],
  "items": [
    {
      "id": 682834967,
      "name": "SSD A400 STANDALONE 480GB 2.5 SATA 3",
      "description": "SSD A400 STANDALONE 480GB 2.5 SATA 3",
      "quantity": 3,
      "original_quantity": 3,
      "delivered_quantity": 3,
      "code": "3985831",
      "extras": []
    }
  ],
  "groups": [],
  "arrived_at": "2022-09-27 16:17:05-0500",
  "waypoint": {
    "latitude": "-12.055802",
    "longitude": "-77.039358"
  },
  "evaluation_answers": [
    {
      "_id": {
        "$oid": "633368541bd6590001ff0b5f"
      },
      "cast": "photo",
      "code": "2bc7a180-e570-0138-5b39-0229ce6ea5a0",
      "name": "Foto de la guía firmada",
      "value": "https://cdn.beetrack.com/mobile_evaluations/images/COMP_IMG_20220927_161700_4308005022088392412.jpg",
      "web": false
    }
  ]
}