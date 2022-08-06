const {Factura} = require('./facturasML')



const factura = new Factura()
// console.log(factura.SubirFactura().then(data => console.log(data)))

async function facturador() {
  try {
    
    await factura.SubirFactura()
  } catch (error) {
    console.log(error)
  }
}

facturador()