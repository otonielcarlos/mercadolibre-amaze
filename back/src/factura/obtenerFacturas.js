const axios = require('axios');
const Downloader = require("nodejs-file-downloader");

class ObtenerFacturas{ 

    async ObtenerFactura(){
        try {
            const url = `https://amaze.com.pe/facturas/5443176163.pdf`;
            const downloader = new Downloader({
                url: url,
                directory: './assets',
                fileName: "5443176163.pdf",
                onBeforeSave: (deducedName) => {
                    console.log(`The file name is: ${deducedName}`);
                    //If you return a string here, it will be used as the name(that includes the extension!).
                  },
            });

            return await downloader.download();
        } catch (error) {
            throw error;
        }
    }

}

const obtener = new ObtenerFacturas();

obtener.ObtenerFactura()

module.exports = {
    ObtenerFacturas 
}