'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const AdminSchema = Schema({
    nombre: String,
    pass: String
})
module.exports = mongoose.model('admin', AdminSchema)