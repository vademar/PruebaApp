'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
    nombre: String,
    apellido:String,
    profesion:String,
    institucion:String,
    cargo:String,
    ci:String,
    password: String,
    signupDate: {type:Date, default:Date.now()}
})

module.exports = mongoose.model('User', UserSchema) 