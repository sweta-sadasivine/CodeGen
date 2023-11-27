const dotenv = require('dotenv');
dotenv.config();

//Fetching requied dependencies
const cors = require('cors');
const express = require('express');
const apiRoutes = require('./routes/apis')

//Assigning port
const port = process.env.PORT || 5000;

//Defining the App
const app = express();

app.use(cors());
app.use(express.json());

//Setting up server port
app.listen(process.env.PORT, () => {
    console.log(`Listening on the port ${process.env.PORT}`)
})

//Defining Routes
app.use('/codegenerator/api', apiRoutes)