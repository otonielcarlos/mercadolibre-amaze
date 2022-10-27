const {default: axios} = require('axios');
// const { token } = require('../tokens/ml');
const {getTokens} = require('../database/mercadolibre/tokens')
const {unlink, readdir, createReadStream} = require('fs');
const FormData = require('form-data');

class Factura {
   async getHeaders() {
        try{
            const accessToken = await getTokens()
            return {
                "Authorization": `Bearer ${ accessToken.mercadolibreapple }`,
            }
        } catch(err){
            console.log(err)
        }
    }

    get path() {
        return `/Users/user/Downloads/Boletas-20-octubre-Apple/`
    }

    DeleteFactura(factura, path) {
        unlink(`${path}${factura}`, err => `successfully deleted ${factura}`)
    }

    getFileNames(){
        return new Promise((resolve, reject) => {
            const document = this.path
            readdir(document, (err, files) => {
                if(err) console.log(err)

                resolve(files)
            })
        })
    }

    async SubirFactura(factura, path, headers) {
        try {
            let data = new FormData()
            data.append('fiscal_document', createReadStream(`${path}${factura}`), factura)
            const orderid  = factura.split('.')[0]
            const url = `https://api.mercadolibre.com/packs/${orderid}/fiscal_documents`
            const secondHeaders = data.getHeaders()
            const resp = await axios.post(url, data, { headers: {...headers, ...secondHeaders} })
            this.DeleteFactura(factura , path)
            console.log(resp.data)
            }
        catch (error) {
            console.log(error.response.data)
        }

    }}

module.exports = {
    Factura
}