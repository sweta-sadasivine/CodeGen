const express = require('express');
const router = express.Router();
const admZip = require("adm-zip");
const codeGen = require('../utility/converter');

router.post('/generate', async (req, res) => {
    try {
        //Converting the request body to JSON 
        const reqBody = JSON.parse(JSON.stringify(req.body));
        //Fetching the download file name
        const outFileName = reqBody.outputFileName;
        //Calling method to generate the file and folders
        const file = await codeGen.converter(reqBody);

        //Generating response for the api
        res.status(200);
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${outFileName}.zip`);
        res.set('Content-Length', file.length);
        res.download(`./converted/${outFileName}.zip`);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "not my propblem" })
    }
})

module.exports = router;