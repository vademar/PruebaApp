'use strict'

const mogoose =require('mongoose')
const connect =  require('../../../database/collections/connect')
const Registro = require('../../../database/collections/users')
const Profesio = require('../../../database/collections/profesiones')
const Events = require('../../../database/collections/eventos')
const Registra = require('../../../database/collections/registra')
const Adminss = require('../../../database/collections/admin')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
//const Img = require('../../../database/collections/img')
const express = require('express')

//esta variables toma el valor de la IP
const HOST = require('../../../database/collections/HOST')

//////////////////////////////////////////////////////////

const multer = require('multer');
const fs = require('fs')
const route = express.Router()
//const qr = require('qr-image');
route.get('/', (req, res) =>{
    res.send({ menssage:'SERVICIO API-RES EVENTOS SEDES'})
    //var code = qr.image("Soy valdemar", { type: 'svg' });
    //res.type('svg');
    //code.pipe(res);
})

// ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ AQUI PARA LOS USUARIOS ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
//*AGREGAR USUARIOS*\\
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
  registro.password = bcryptjs.hashSync(req.body.password,10);
  
  Registro.findOne({'ci':registro.ci},(err,e) => {
    if(e){
      res.status(404).json({"msn":`Esta Cedula: ${registro.ci} ya se encuentra registrado`})
      console.log('msn')
    }
    else{
      registro.save((err, usertStored) =>{
      if(err) {
        res.status(404).send({"msn": `Error al salvar la base de datos:${err}`})
        console.log(err)
      }
      console.log('guardado')
      res.status(200).json({"msn":`Registrado Con Exito`})
      })
    }
  })
})
/// MOSTRAR TODO \\\
route.get('/registro/',(req, res)=>{
  Registro.find({}, (err, mostrar) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!mostrar) return res.status(404).send({message:`no existen usarios :${err}`})    
    res.send(200,{mostrar})
  })
})
///BUSCAR POR CEDULA\\\
route.get('/registro/:ci',(req, res)=>{
  let cii = req.params.ci;
  console.log(cii)
  Registro.find({ci:cii}).exec((err, Usuario) => {
    if(err) return res.status(500).send({message:`Error Al Buscar:${err}`})
    if(!Registro) return res.status(404).send({message:`el usuario no existe:${err}`})
    else return res.status(200).send({message:`No existe usuario:${err}`})
    res.status(200).send({Usuario})
  })
})
//*ACTUALIZAR USUARIOS*\\
route.put('/registro/:id',(req, res) => {
  let id = req.params.id
  let update = req.body
  Registro.findByIdAndUpdate(id, update, (err, actUs) => {
    if(err) return res.status(500).send({"msn":`error al actualizar al usuario:${err}`})
    if(!actUs) res.status(404).send({"msn": `No existe el Usuario `})
    res.status(200).send({"msn":`Usuario actualizado`})
    console.log(actUs)
  })
})
//*ELIMINAR USUARIOS*\\
route.delete('/registro/:Us',(req, res)=>{
  let Cii = req.params.Us
  Registro.findOne({ci:Cii}).exec((err,Usuario) => {
    if(err) res.status(500).send({"msn":`error al borrar`})
    if(!Usuario) return res.status(404).send({"msn": `The User you want to eliminate does not exist`}) 
    Usuario.remove(err => {
      if(err) return res.status(500).send({"msn":`Fallo al borrar:${err}`})
      res.status(200).send({"msn":`El usuario a sido eliminado`})
    })
  })
})

// ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ AQUI PARA EL INICIO DE SESION ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
route.get('/login/:ci=:pass', (req, res) =>{
  let cii = req.params.ci;
  let pass = req.params.pass;
  console.log(cii);
  console.log(pass);
  
  Registro.findOne({ci:cii},(err,usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok:false,err
      })
    }

    if(!usuarioDB){
      return res.status(400).json({
        err:{"msn":'(usuario) incorrecto'}
      })
    }

    if(!bcryptjs.compareSync(pass,usuarioDB.password)){
      return res.status(400).json({
        err:{"msn":'(Contraseña) incorrecta'}
      })
    }
    //token//
    let token=jwt.sign({
      usuarios: usuarioDB
    },'Mi_secreto',{expiresIn:60*60*24*30})

    res.json({
      ok:true,
      usuarios:usuarioDB,
      token:token
    })
  })
})

// ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ AQUI PARA LOS PROFESIONES ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
//*AGREGAR PROFESIONES*\\
route.post('/profesiones', (req, res) =>{
  console.log('POST /api/profesiones')
  console.log("request; ",req.body)
  let prof = new Profesio()
  prof.profesiones = req.body.profesiones
  prof.precio = req.body.precio
  Profesio.findOne({'profesiones':prof.profesiones},(err,e) => {
    if(e){
      console.log('Profesion repetida')
      res.status(404).json({"msn":`this profession: ${prof.profesiones} is already registered`})
    }
    else{
      prof.save((err, usertStored) =>{
        if(err) {
          res.status(404).send({"msn": `Error with the connection to the database ${err}`})
          console.log(err)
        }
        console.log('guardado')
        res.status(200).json({"msn":`Successful Registration`})
      })
    }
  })
})
//*DEVOLVER DATOS*\\
route.get('/profesiones/',(req, res)=>{
  Profesio.find({}, (err, Profesion) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!Profesion) return res.status(404).send({message:`no existen usarios:${err}`})
    
    res.send(200,{Profesion});
  })
})
//*ELIMINAR PROFESIONES*\\
route.delete('/profesiones/:pro',(req, res)=>{
  let Bo = req.params.pro
  Profesio.findOne({profesiones:Bo}).exec((err, proff) => {
    if(err) res.status(500).send({"msn":`Error deleting`})
    if(!proff) return res.status(404).send({"msn": `The Profession you want to eliminate does not exist`}) 
    proff.remove(err=>{
      if(err) res.status(500).send({"msn":`Failed to delete the profession`})
      res.status(200).send({"msn":`The profession was successfully deleted`})
    })
  })
})
//*ACTUALIZAR PROFESIONES*\\
route.put('/profesiones/:pros',(req, res) => {
  let id = req.params.pros
  let update = req.body
  console.log(id);
  Profesio.findByIdAndUpdate(id, update, (err, actUs) => {
    if(err) return res.status(500).send({"msn":`Error Updating`})
    if(!actUs) res.status(404).send({ "msn": `the profession was not updated`})
    res.status(200).send({"msn":`Successfully updated profession`})
    console.log(actUs)
  })
})

// ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ AQUI PARA LOS EVENTOS ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
//*AGREGAR EVENTOS*\\
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
      res.status(404).json({"msn":`Este Evento: ${eve.nombre} ya se encuentra registrado`})
    }
    else{
      eve.save((err, Nevento) =>{
      if(err) {
        res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
        console.log(messaje)
      }
      res.status(200).json({"msn":`Registrado Con Exito`})
      })
    }
  })
})
// * DEVOLVER DATOS  DE EVENTOS * \\
route.get('/Events/',(req, res)=>{
  Events.find({}, (err, event) =>{
    if(err) return res.status(500).send({"msn":`error al realizar la peticion:${err}`})
    if(!event) return res.status(404).send({"msn":`no existen usarios:${err}`})
    res.send(200,{event})
  })
})
//*ACTUALIZAR EVENTOS*\\
route.put('/Events/:eve',(req, res) => {
  let id = req.params.eve
  let update = req.body
  console.log(id);
  Events.findByIdAndUpdate(id, update, (err, Acteve) => {
    if(err) return res.status(500).send({"msn":`Error Updating`})
    if(!Acteve) res.status(404).send({ "msn": `the Event was not updated`})
    res.status(200).send({"msn":`Successfully updated Event`})
    console.log(Acteve)
  })
})
//*ELIMINAR EVENTOS*\\
route.delete('/Events/:pro',(req, res)=>{
  let Bo = req.params.pro
  Events.findOne({nombre:Bo}).exec((err, Acteve) => {
    if(err) res.status(500).send({"msn":`Error deleting`})
    if(!Acteve) return res.status(404).send({"msn": `The Event you want to eliminate does not exist`}) 
    Acteve.remove(err=>{
      if(err) res.status(500).send({"msn":`Failed to delete the Event`})
      res.status(200).send({"msn":`The Event was successfully deleted`})
    })
  })
})

//▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ AQUI PARA EL REGISTRO DE USUARIOS EN EVENTOS ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
route.post('/registrarlos', (req, res) =>{
  console.log('POST /api/registrarlos')
  let regis = new Registra()
  regis.eventos = req.body.eventos
  regis.usuarios = req.body.usuarios
  
  regis.save((err, usertStored) =>{
    if(err) {
      res.status(404).send({"msn": `Error with the connection to the database ${err}`})
      console.log(err)
    }
      console.log('guardado')
      res.status(200).json({"msn":`Successful Registration`})
  })
});
//*DEVOLVER DATOS DE REGISTRO DE USUARIOS EN EVENTOS*\\
route.get('/registrarlos/',(req, res)=>{
  Registra.find({}, (err, Regis) =>{
    if(err) return res.status(500).send({"msn":`error al realizar la peticion:${err}`})
    if(!Regis) return res.status(404).send({"msn":`no existen registros:${err}`})
    console.log(Regis)
    res.send(200,{Regis});
  })
})
// ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ AQUI PARA LOS ADMINISTRADORES ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
//*AGREGAR ADMINISTRADOR*\\
route.post('/adminis', (req, res) =>{
  console.log('POST /api/adminis')
  console.log("request; ",req.body)
  let admi = new Adminss()
  admi.nombre = req.body.nombre
  admi.pass = req.body.pass
  Adminss.findOne({'nombre':admi.nombre},(err,e) => {
    if(e){
      console.log('administrador repetida')
      res.status(404).json({"msn":`this admin: ${admi.nombre } is already registered`})
    }
    else{
      admi.save((err, Nadmin) =>{
        if(err) {
          res.status(404).send({"msn": `Error with the connection to the database ${err}`})
          console.log(err)
        }
        res.status(200).json({"msn":`Successful Registration`})
      })
    }
  })
})
//*DEVOLVER DATOS*\\
route.get('/adminis/',(req, res)=>{
  Adminss.find({}, (err, admis) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!admis) return res.status(404).send({message:`no existen administradores:${err}`})
    
    res.send(200,{admis});
  })
})
//*ELIMINAR ADMINISTRADORES*\\
route.delete('/adminis/:pro',(req, res)=>{
  let Bo = req.params.pro
  Adminss.findOne({nombre:Bo}).exec((err, ADMI) => {
    if(err) res.status(500).send({"msn":`Error deleting`})
    if(!ADMI) return res.status(404).send({"msn": `The Administer you want to eliminate does not exist`}) 
    ADMI.remove(err=>{
      if(err) res.status(500).send({"msn":`Failed to delete the Administrator`})
      res.status(200).send({"msn":`The Administrator was successfully deleted`})
    })
  })
})
// ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ INICIO DE SESION DE ADMINISTRADORES ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓
route.get('/sesion/:ci=:pass', (req, res) =>{
  let cii = req.params.ci;
  let con = req.params.pass;
  console.log(cii);
  console.log(con);
  
  Adminss.findOne({nombre:cii,pass:con},(err,admin)=>{
    if(err) return res.status(500).send({"msn":`error al realizar la peticion:${err}`})
    if(!admin) return res.status(404).send({"msn":`Por Favor revise sus Datos:`})
    
    res.send(200,{admin});
  })
})

module.exports = route