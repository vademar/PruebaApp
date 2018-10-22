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
    password: {type:String, select:false},
    signupDate: {type:Date, default:Date.now()},
    lastLogin:Date
})

/*UserSchema.pre('save',(next) =>{
 let user =this
 if(!user.isModyfied('password')) return next()

 bcrypt.genSalt(10,(err,sal )=>{
     if(err)return next()
     bcrypt.hash(user.password, salt, null, (err, hash) => {
         if(err) return next(err)
         user.password = hash
         next();
     })
 })
})
UserSchema.methodos.gravatar = function(){
    if(!this.ci)return 'https://gravatar.com/avatar/?s=200d=retro'

    const md5 = crypto.createHash('md5').update (this.ci).digest('hex')
    return `https://gravatar.com/avatar/${md5}?s=200d=retro`
}*/
module.exports = mongoose.model('User', UserSchema)