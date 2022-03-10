'use strict'

const User = require('../models/user.model');
const Category = require('../models/category.model');
const Product = require('../models/product.model');
const bcrypt = require('bcrypt-nodejs');

exports.validateData = (data)=>{
    let keys = Object.keys(data), msg = '';

    for(let key of keys){
        if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
            msg += `The param ${key} is required\n`;
    }
    return msg.trim();
}

exports.searchUser = async (username)=>{
    try{
        //lógica (Buscar en la BD mediante username)
        let exist = User.findOne({username: username}).lean() //.lean() = mongooseObject -> javascript Object
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.encrypt = async (password)=>{
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkPermission = async (userId, sub)=>{
    try{
        if(userId != sub) return false;
        else return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.checkUpdate = async (user)=>{
    try{
        if(user.password || Object.entries(user).length === 0 || user.role)
            return false;
        else 
            return true;
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteSensitiveData = async(data) =>{
    try {
        delete data.user.password;
        delete data.user.role;
        return data;
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkRole = async(user) =>{
    try {
        let exist = User.findOne({user: user.role}).lean()
            if(user.role === CLIENT) return true;
            else return false;
    } catch (err) {
        console.log(err);
        return err;
    }
}

//CATEGORY

exports.searchCategory = async (nameCategory)=>{
    try{
        //lógica (Buscar en la BD mediante nameCategory)
        let exist = Category.findOne({nameCategory: nameCategory}).lean() //.lean() = mongooseObject -> javascript Object
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}

//PRODUCT 

exports.searchProduct= async (nameProduct)=>{
    try{
        //lógica (Buscar en la BD mediante nameProduct)
        let exist = Product.findOne({nameProduct: nameProduct}).lean() //.lean() = mongooseObject -> javascript Object
        return exist;
    }catch(err){
        console.log(err);
        return err;
    }
}