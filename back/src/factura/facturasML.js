const {default: axios} = require('axios');
const { token } = require('../tokens/ml');
const {unlink, readdir, createReadStream} = require('fs');
const FormData = require('form-data');

class Factura {
    

   async getHeaders() {
        try{
            const accessToken = await token()
            return {
                "Authorization": `Bearer ${ accessToken }`,
            }

        } catch(err){
            console.log(err)
        }
    }

    get path() {
        return `/Users/user/Downloads/amaze04Jul_part2/`
    }

    DeleteFactura(factura, path) {
        unlink(`${path}${factura}`, err => `successfully deleted ${factura}`)
    }

    async SubirFactura(factura, path, headers) {
        try {
            let data = new FormData();
            data.append('fiscal_document', createReadStream(`${path}${factura}`), factura)
            const orderid  = factura.split('.')[0]
            const url = `https://api.mercadolibre.com/packs/${orderid}/fiscal_documents`
            const secondHeaders = data.getHeaders()
            const resp = await axios.post(url, data, { headers: {...headers, ...secondHeaders} });
            this.DeleteFactura(factura , path)
            console.log(resp.data);
            }
        catch (error) {
            unlink(`/Users/user/Downloads/amaze04Jul_part2/${factura}`, err => (err) ? console.log(err): `successfully deleted ${factura}`)
            console.log(error.response.data)
        }

    }}

module.exports = {
    Factura
}