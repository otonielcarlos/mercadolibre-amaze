const axios = require('axios');
const { token } = require('./ml');

const getDate = async (resource) => {
    try {
        
        return new Promise(async (resolve, reject) => {
            try {
                let accessToken = await token();
                let resDate = await axios.get(
                    `https://api.mercadolibre.com/${resource}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                    );
                let dateCreated = resDate.data.date_created;
                let fullDate = dateCreated.slice(0, 10);
                resolve(fullDate);
            } catch (error) {
             console.log('error en promise async');   
            }
        })
    } catch (error) {
        console.log(error);
        reject(error);
    }
}

module.exports = {
    getDate
}