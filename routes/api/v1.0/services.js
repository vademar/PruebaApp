'use strict'

const mogoose =require('mongoose')
const connect =  require('../../../database/collections/connect')
const Registro = require('../../../database/collections/users')
const Profesio = require('../../../database/collections/profesiones')
const Events = require('../../../database/collections/eventos')
const Regiss = require('../../../database/collections/regis')
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
  registro.password = bcryptjs.hashSync(req.body.password,10);
  
  Registro.findOne({'ci':registro.ci},(err,e) => {
    if(e){
      res.status(404).json({"msn":`Esta Cedula: ${registro.ci} ya se encuentra registrado`})
      console.log('msn')
    }
    else{
      registro.save((err, usertStored) =>{
      if(err) {
        res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
        console.log(err)
      }
      console.log('guardado')
      res.status(200).json({"msn":`Registrado Con Exito`})
      })
    }
  })
})

///buscar po CI
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
        ok:false,
        err:{
          "msn":'(usuario) incorrecto'
        }
      })
    }


    if(!bcryptjs.compareSync(pass,usuarioDB.password)){
      return res.status(400).json(({
        ok: false,
        err:{
          "msn":'(Contraseña) incorrecta'
        }
      }))
      console.log("msn");
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
  console.log('Exacto')

})


//*-*-*-*-*-*-*-*-*-* AQUI PARA LAS PROFESIONES *-*-*-*-*-*-*-*-*//
//*AGREGAR DATOS*\\
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
      console.log("msn");
    }
    else{
      prof.save((err, usertStored) =>{
        if(err) {
          res.status(404).send({messaje: `Error with the connection to the database ${err}`})
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
//*EIMINAR DATOS*\\
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
//actualizar  por id
route.put('/profesiones/:pros',(req, res) => {
  let id = req.params.pros
  let update = req.body
  console.log(id);
  Profesio.findByIdAndUpdate(id, update, (err, actUs) => {
    if(err) return res.status(500).send({"msn":`error al actualizar el producto`})
    if(!actUs) res.status(404).send({ "msn": `No existe tal producto `})
    res.status(200).send({"msn":`profesion actualizada`})
    console.log(actUs)
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

//devolver los datos
route.get('/Events/',(req, res)=>{
  Events.find({}, (err, event) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!event) return res.status(404).send({message:`no existen usarios:${err}`})
    res.send(200,{event})
  })
})
//♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ ♫ AQUI PARA EL REGISTRO DE USUARIOS EN EVENTOS
route.post('/regis', (req, res) =>{
  console.log('POST /api/regis')
  console.log("request; ",req.body)
  let usreg = new Regiss()
  usreg.ev_nom = req.body.ev_nom
  usreg.ev_descrip = req.body.ev_descrip
  usreg.us_nom = req.body.us_nom
  usreg.us_ci = req.body.us_ci
  usreg.monto = req.body.monto
  
  Regiss.findOne({'us_ci':usreg.us_ci},(err,req) => {
    if(req){
      res.status(404).json({"msn":`Usuario: ${usreg.us_ci} ya se encuentra registrado en ${usreg.ev_nom}`})
    }
    else{
      usreg.save((err, Revento) =>{
      if(err) {
        res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
        console.log(err)
      }
      res.status(200).json({"msn":`Registrado Con Exito`})
      })
    }
  })
});
//*DEVOLVER DATOS*\\
route.get('/regis/',(req, res)=>{
  Regiss.find({}, (err, Register) =>{
    if(err) return res.status(500).send({message:`error al realizar la peticion:${err}`})
    if(!Register) return res.status(404).send({message:`no existen registros:${err}`})
    
    res.send(200,{Register});
  })
})
module.exports = route