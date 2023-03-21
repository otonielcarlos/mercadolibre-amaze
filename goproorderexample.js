const { default: axios } = require("axios")

const deliveries = [
{ingramOrder: '7100362981', customerPO: 'XIAOMI_1071', delivery:  '8099171753'},
{ingramOrder: '7100325002', customerPO: 'XIAOMI_1072', delivery:  '8098913470'},
{ingramOrder: '7100323109', customerPO: 'XIAOMI_1073', delivery:  '8098913469'},
{ingramOrder: '7100357937', customerPO: 'XIAOMI_1074', delivery:  '8098913471'},
{ingramOrder: '7100358934', customerPO: 'XIAOMI_1075', delivery:  '8099171752'},
{ingramOrder: '7100364080', customerPO: 'XIAOMI_1078', delivery:  '8099171755'},
{ingramOrder: '7100357876', customerPO: 'XIAOMI_1079', delivery:  '8099171732'},
{ingramOrder: '7100362472', customerPO: 'XIAOMI_1081', delivery:  '8099171733'},
{ingramOrder: '7100365180', customerPO: 'XIAOMI_1082', delivery:  '8099171756'}
]


async function update(deliveries) {
  for (let order of deliveries) {
    const {ingramOrder, customerPO, delivery} = order
    try {
      const data = {
        "resource": "dispatch_guide",
        "event": "create",
        "account_name": "Ingram Micro Peru",
        "dispatch_guide": {
          "guide": "021-0011228",
          "beecode": "94f06fb395ba0322be5c3696",
          "identifier": "021-0011228",
          "account_id": 2572,
          "promised_date": null,
          "min_delivery_time": null,
          "max_delivery_time": null,
          "contact_name": "CSI RENTING PERU S.A.C.",
          "contact_phone": "2089430",
          "contact_identifier": "20606185775",
          "contact_email": "Karla.Madico@csirenting.pe",
          "contact_address": "BSF ALMACENES DEL PERU, KM 38 PANAM PUNTA HERMOSA, PUNTA HERMOSA, LIMA, LIMA"
        },
        "tags": [
          {
            "name": "Contacto",
            "value": "KARLA MADICO"
          },
          {
            "name": "Delivery",
            "value": delivery
          },
          {
            "name": "Factura Sap",
            "value": "9922795786"
          },
          {
            "name": "Factura Sunat",
            "value": "01_F007_0427788"
          },
          {
            "name": "Nota de venta",
            "value": ingramOrder
          },
          {
            "name": "OC",
            "value": customerPO
          }
        ],
        "groups": []
      }
      const updateDelivery = await axios.post('https://appleamaze.herokuapp.com/pe/v1/delivery/beetrack/guide', data)

    } catch (error) {
      console.log(error)
    }
  }
}
update(deliveries)