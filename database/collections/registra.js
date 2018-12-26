'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const RegisSchema = Schema({
    eventos: String,
    usuarios: String
})
module.exports = mongoose.model('Regi', RegisSchema)