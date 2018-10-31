'use strict'

const mogoose =require('mongoose')
const connect =  require('../../../database/collections/connect')
const Registro = require('../../../database/collections/users')
const Profesio = require('../../../database/collections/profesiones')
const Events = require('../../../database/collections/eventos')

//const Img = require('../../../database/collections/img')
const express = require('express')

//esta variables toma el valor de la IP
const HOST = require('../../../database/collections/HOST')

//////////////////////////////////////////////////////////

const multer = require('multer');
const fs = require('fs')
const route = express.Router()

route.get('/', (req, res) =>{
    res.send({ menssage:'SERVICIO API-RES EVENTOS SEDES'})
})

// metodos de peticion GET, POTS, PUT, DELETE
//registro de usuarios usando la coleccion users

route.post('/registro', (req, res) =>{

  console.log('POST /api/registro')
  console.log("request; ",req.body)

  let registro = new Registro()
  registro.nombre = req.body.nombre
  registro.apellido = req.body.apellido
  registro.ci = req.body.ci
  registro.profesion = req.body.profesion
  registro.institucion = req.body.institucion
  registro.cargo = req.body.cargo
  registro.password = req.body.password
  
  Registro.findOne({'ci':registro.ci},(err,e) => {
    if(e){
        console.log('Cedula repetida')
        res.status(404).send({message:`Esta Cedula: ${registro.ci} ya se encuentra registrado`})
    }
    else{
        registro.save((err, usertStored) =>{
            if(err) {
              res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
              console.log(err)
            }
            res.status(200).send(usertStored)
        })
    }
  })
})

///buscar po ID
route.get('/registro/:ci',(req, res)=>{
  let ci = req.params.ci
  Registro.findById(ci,(err, Usuario) => {
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!Registro) return res.status(404).send({message:`el usuario no existe:${err}`})
    
    res.status(200).send({Usuario})
  })
})

///buscar todo
route.get('/registro/',(req, res)=>{
  Registro.find({}, (err, mostrar) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!mostrar) return res.status(404).send({message:`no existen usarios :${err}`})    
    res.send(200,{mostrar})
  })
})

//actualizar  por id
route.put('/registro/:id',(req, res) => {
  let id = req.params.id
  let update = req.body
  Registro.findByIdAndUpdate(id, update, (err, actUs) => {
    if(err) return res.status(500).send({message:`error al actualizar:${err}`})
    res.status(200).send({actUs})
  })
})

///eliminar
route.delete('/registro/:Bo',(req, res)=>{
  let Bo = req.params.Bo
  Registro.findById(Bo, (err,Usuario)=>{
    if(err) return res.status(500).send({message:`error al borrar1:${err}`})
    Usuario.remove(err => {
      if(err) return res.status(500).send({message:`error al borrar2:${err}`})
      res.status(200).send({message:`El usuario a sido eliminado:`})
    })
  })
})

//♠ ♠ ♠ ♠ ♠ ♠ ♠ ♠ AQUI EL INICIO DE SESION ♠ ♠ ♠ ♠ ♠ ♠ ♠ ♠ ♠ ♠ ♠ //
route.get('/login/:ci=:password', (req, res) =>{
  //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
  console.log(req.params)

  let ci =req.params.ci
  let password=req.params.password

  Registro.find({"ci":ci,"password":password}, (err, user) =>{
      if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
      if(user.length == 0) return res.status(404).send({message:`EL Usuario No Existe`})
      
      res.status(200).send({'ci':user})
  })
})

//*-*-*-*-*-*-*-*-*-* AQUI PARA LAS PROFESIONES *-*-*-*-*-*-*-*-*//
route.get('/profesiones/',(req, res)=>{
  Profesio.find({}, (err, Profesion) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!Profesion) return res.status(404).send({message:`no existen usarios:${err}`})
    
    res.send(200,{Profesion})
  })
})
route.post('/profesiones', (req, res) =>{
  console.log('POST /api/profesiones')
  console.log("request; ",req.body)

  let prof = new Profesio()
  prof.profesiones = req.body.profesiones
  prof.precio = req.body.precio
  
  Profesio.findOne({'profesiones':prof.profesiones},(err,e) => {
    if(e){
        console.log('profesion repetida')
        res.status(404).send({message:`Esta profesion: ${prof.profesiones} ya se encuentra registrado`})
    }
    else{
        prof.save((err, usertStored) =>{
            if(err) {
              res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
              console.log(err)
            }
            res.status(200).send(usertStored)
        })
    }
  })
})
//♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ AQUI PARA LOS EVENTOS ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫//

route.post('/Events', (req, res) =>{
  console.log('POST /api/Events')
  console.log("request; ",req.body)

  let eve = new Events()
  eve.nombre = req.body.nombre
  eve.fechaIni = req.body.fechaIni
  eve.horaIni = req.body.horaIni
  eve.fechaFin = req.body.fechaFin
  eve.horaFin = req.body.horaFin
  eve.descripcion = req.body.descripcion
  eve.invitados = req.body.invitados
  
  Events.findOne({'nombre':eve.nombre},(err,e) => {
    if(e){
        console.log('Evento repetido')
        res.status(404).send({message:`Esta evento: ${eve.nombre} ya se encuentra registrado`})
    }
    else{
        eve.save((err, Nevento) =>{
            if(err) {
              res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
              console.log(err)
            }
            res.status(200).send(Nevento)
        })
    }
  })
})

//devolver los datos
route.get('/Events/',(req, res)=>{
  Events.find({}, (err, event) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!event) return res.status(404).send({message:`no existen usarios:${err}`})
    res.send(200,{event})
  })
})

module.exports = route