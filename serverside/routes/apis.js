const express = require('express');
const router = express.Router();
const codeGen = require('../utility/converter')

router.post('/generate', async(req, res) => {
    try{
        codeGen.converter(JSON.stringify(req.body));
        res.status(200).json({message: "files and folders created"})
    }catch(error){
        console.log(error)
        res.status(400).json({error: "not my propblem"})
    }
})

module.exports = router;