'use strict'
//
const IPWIFI = require('./database/collections/HOST')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 4040

//const service = require('./routes/api/v1.0')
const service = require('./routes/api/v1.0/services')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//servicios del api-rset 
app.use('/api/v1.0/',service)
app.use(service)

app.listen(port, () => {
    console.log(`Api-rest sedes corriendo en ${IPWIFI}:${port}`) 
}) 

module.exports = app