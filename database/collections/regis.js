'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const RegisSchema = Schema({
    ev_nom: String,
    ev_descrip: String,
    us_nom: String,
    us_ci: String,
    monto: String
})
module.exports = mongoose.model('Regis', RegisSchema)