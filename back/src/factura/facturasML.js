const axios = require('axios');
const { token } = require('../tokens/ml');
const fs = require('fs');
const FormData = require('form-data');

class Factura {
    url = "https://api.mercadolibre.com/packs/5443176163/fiscal_documents"

    get getHeaders() {
        return {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${ token }`
        }
    }

    async SubirFactura() {
        try {
            const data = new FormData();
            data.append('fiscal_document', fs.createReadStream('../assets/5443176163.pdf'))

            const resp = await axios.post(this.url, { headers: this.getHeaders, ...data.getHeaders() }, data);

            console.log(resp);

        } catch (error) {
            throw error;
        }
    }
}

const f = new Factura()

f.SubirFactura();

module.exports = {
    Factura
}