'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const UserSchema = Schema({
    nombre: String,
    apellido:String,
    profesion:String,
    institucion:String,
    cargo:String,
    ci:{type:String, unique:true},
    password: {type:String, select:true},
    signupDate: {type:Date, default:Date.now()},
    lastLogin:Date
})
module.exports = mongoose.model('User', UserSchema)