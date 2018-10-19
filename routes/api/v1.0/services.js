'use strict'

const mogoose =require('mongoose')
const connect =  require('../../../database/collections/connect')
const Registro = require('../../../database/collections/users')

//const Img = require('../../../database/collections/img')
const express = require('express')

//esta variables toma el valor de la IP
const HOST = require('../../../database/collections/HOST')

//////////////////////////////////////////////////////////

const multer = require('multer');
const fs = require('fs')
const route = express.Router()

// metodos de peticion GET, POTS, PUT, DELETE
route.get('/', (req, res) =>{
    res.send({ menssage:'SERVICIO API-RES EVENTOS SEDES'})
})

//registro de usuarios ujsando la coleccion users
route.post('/registro', (req, res) =>{
  console.log('POST /api/registro')
  console.log(req.body)
  
  let registro = new Registro()
  registro.nombre =req.body.nombre
  registro.apellido = req.body.apellido
  registro.profesion = req.body.profesion
  registro.institucion = req.body.institucion
  registro.cargo = req.body.cargo
  registro.celular = req.body.celular
  registro.ci = req.body.ci
  registro.password = req.body.password

  registro.save((err, usertStored) =>{
    if(err) res.status(404).send({message: `Error al salvar la base de datos:${err}`})
    res.status(200).send(usertStored);
  })
})

///buscar po ID
route.get('/registro/:ci',(req, res)=>{
  let ci = req.params.ci
  registro.findById(ci,(err, Usuario) => {
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!registro) return res.status(404).send({message:`el usuario no existe:${err}`})
    
    res.status(200).send({Usuario})
  })
})

///buscar todo
route.get('/registro/',(req, res)=>{
  registro.find({}, (err, mostrar) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!mostrar) return res.status(404).send({message:`no existen usarios:${err}`})
    res.send(200,{mostrar})
  })
})

//actualizar  por id
route.put('/registro/:id',(req, res) => {
  let id = req.params.id
  let update = req.body
  registro.findByIdAndUpdate(id, update, (err, actUs) => {
    if(err) return res.status(500).send({message:`error al actualizar:${err}`})
    res.status(200).send({actUs})
  })
})

///eliminar
route.delete('/registro/:Bo',(req, res)=>{
  let Bo = req.params.Bo
  registro.findById(Bo, (err,Usuario)=>{
    if(err) return res.status(500).send({message:`error al borrar1:${err}`})
    Usuario.remove(err => {
      if(err) return res.status(500).send({message:`error al borrar2:${err}`})
      res.status(200).send({message:`El usuarioa sido elminado:`})
    })
  })
})

module.exports = route