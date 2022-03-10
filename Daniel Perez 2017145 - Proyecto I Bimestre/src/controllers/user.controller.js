'use strict'

const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Bill = require('../models/bill.model');
const {validateData, searchUser, encrypt, checkPassword, checkPermission, checkUpdate, 
            deleteSensitiveData,
            checkRole} = require('../utils/validate');
const jwt = require('../services/jwt');

exports.test = (req, res)=>{
    return res.send({message: 'Function test is running'});
}

exports.register = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            lastname: params.lastname,
            username: params.username,
            password: params.password,
            role: 'CLIENT'
        }
        const msg = validateData(data);

        if(!msg){          
            const userExist = await searchUser(params.username);
            if(!userExist){
                data.email = params.email;
                data.phone = params.phone;
                data.password = await encrypt(params.password);
            
                let user = new User(data);
                await user.save();
                return res.send({message: 'User created successfully'});
            }else{
                return res.send({message: 'Username already in use, choose another username'}); 
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.login = async (req, res)=>{
    try{
        const params = req.body;
        const data = { //los parámetros que quiero que sean obligatorios
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if(!msg){
            let userExist = await searchUser(params.username);
            if(userExist && await checkPassword(params.password, userExist.password)){
                const token = await jwt.createToken(userExist);
                if(userExist.role === 'CLIENT'){
                    const data = {
                        user: userExist._id,
                        total: 0
                    }
                    const cart = new Cart(data);
                    const searchCart = await Cart.findOne({user: userExist._id});
                    if(!searchCart){
                        await cart.save();
                        return res.send({token, message:'Loged and Cart created'});
                    }else{
                        const userId = userExist._id;
                        const searchBills = await Bill.find({user: userId});
                        if(!searchBills){
                            return res.send({token, message:'Entering the system, this user already has a cart, no bills found'});
                        }else{
                            return res.send({token, message:'Entering the system, this user already has a cart, bills found', searchBills});
                        }
                    }
                }else{
                    return res.send({token, message:'Loged'});
                }
            }else{
                return res.send({message: 'Username or password incorrect'});
            }
        }else{
            return res.status(400).send(msg);
        }
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.update = async (req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(403).send({message: 'Unauthorized to update this user'});
        else{
            const notUpdated = await checkUpdate(params);
            if(notUpdated === false) return res.status(400).send({message: 'This params can only update by admin'});
            const already = await searchUser(params.username);
            if(!already){
                const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new:true})
                .lean()
                return res.send({ userUpdate, message: 'User updated'});
            }else{
                return res.send({message: 'Username already taken'})
            } 
        }    
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.delete = async(req, res)=>{
    try{
        const userId = req.params.id;
        const permission = await checkPermission(userId, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'Unauthorized to delete this user'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.status(500).send({message: 'User not found or already deleted'});
        return res.send({message: 'Account deleted'});
    }catch(err){
        console.log(err);
        return err;
    }
}

//FUNCIONES PARA LOS ADMINISTRADORES

exports.updateRole = async(req, res) => {
    try {
        const params = req.body;
        const userId = req.params.id;
        const data = {
            role: params.role
        }
        const msg = validateData(data);
        if(msg) return res.send(msg);
            if(params.username || params.password || params.phone || params.name || params.lastname || params.email){
                return res.send({message:'Role only required'});
           
            }else{
                const roleUpdate = await User.findOneAndUpdate({_id: userId}, data, {new: true}).lean();
                return res.send({message:'The role has been updated', roleUpdate});
            }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateUserByAdmin = async(req, res)=>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const user = await User.findOne({_id: userId});
        if(user){
            if(user.role === 'CLIENT'){
                params.password = await encrypt(params.password);
                const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new:true}).lean();
                return res.send({userUpdate, message: 'User updated'});
            }else return res.send({message:'Unauthorized action'});
        }else return res.status(400).send({message: 'User not found'});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleUserByAdmin = async(req, res) =>{
    try{
        const userId = req.params.id;
        const params = req.body;
        const user = await User.findOne({_id: userId});
        if(user){
            if(user.role === 'CLIENT'){
                const userDeleted = await User.findOneAndDelete({_id: userId});
                return res.send({message: 'User deleted'});
            }else return res.send({message:'Unauthorized action'});
        }else return res.status(400).send({message: 'User not found'});
    }catch(err){
        console.log(err);
        return err;
    }
}
