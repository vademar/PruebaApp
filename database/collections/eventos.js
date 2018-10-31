'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const EventosSchema = Schema({
    nombre: String,
    fechaIni: String,
    horaIni: String,
    fechaFin: String,
    horaFin: String,
    descripcion: String,
    invitados: String
})
module.exports = mongoose.model('Evento', EventosSchema)