const { types, string, number, ref } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose=require('passport-local-mongoose')

const UserSchema= new Schema({
     
    // fullname:{
    //     type:string,
    //     required:true,
    // },
    
  email: {
    type: String,
    required: true,
    unique: true
  }
    // phonenumber:{
    //     type:number,
    //     required:true,
    // },
    // listing:[
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:"Listing"
    //     }
    // ]
},{timestamps:true})

UserSchema.plugin(passportLocalMongoose);

const usermodel=new mongoose.model("usermodel",UserSchema)

module.exports = usermodel;