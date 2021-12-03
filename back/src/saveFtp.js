const ftp = require("basic-ftp")

<<<<<<< HEAD


async function savePdfToServer(name) {
    const client = new ftp.Client()
    client.ftp.verbose = true
=======
async function savePdfToServer(name) {
    const client = new ftp.Client()
    // client.ftp.verbose = true
>>>>>>> pdfbranch
    try {
        await client.access({
            host: "173.231.198.187",
            user: "amazecom",
            password: "6vB2YVxW5=%r",
            secure: false
        })
<<<<<<< HEAD
        console.log(await client.list())
=======
        await client.list()
>>>>>>> pdfbranch
        await client.uploadFrom(`back/src/etiqueta/${name}`, `public_html/appleml/${name}`)
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}
module.exports = {
    savePdfToServer
}

