'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const ProfesionSchema = Schema({
    profesiones: String,
    precio: String
})
module.exports = mongoose.model('Profes', ProfesionSchema)