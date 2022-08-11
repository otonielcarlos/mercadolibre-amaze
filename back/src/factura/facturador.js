const {Factura} = require('./facturasML')
const {readdir} = require('fs')


const factura = new Factura()
// console.log(factura.SubirFactura().then(data => console.log(data)))

async function facturador() {
  try {
    const headers = await factura.getHeaders()
    const names = await factura.getFileNames()
    for(let name of names){
      try {
        await factura.SubirFactura(name, factura.path, headers)
      } catch (error) {
        console.log(error)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

facturador()