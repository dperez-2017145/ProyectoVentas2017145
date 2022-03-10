'use strict'


const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Bill = require('../models/bill.model');
const {validateData} = require('../utils/validate');

exports.createBill = async(req, res) =>{
    try {
        const cart = await Cart.findOne({user: req.user.sub});
        const userId = req.user.sub;
        const data = {
            cart: cart._id,
            date: new Date,
            user: cart.user,
            products: cart.products,
            total: cart.total
        }

        const msg = await validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            if(Object.entries(cart.products).length === 0){
                return res.send({message:'The shopping cart is empty'});
            }else{
                const bill = new Bill(data);
                await bill.save();
                const withOutData =[]
                const cartClear = await Cart.findOneAndUpdate({user: userId}, {products: withOutData, total:0}, {new:true});
                const searchBill = await Bill.findOne({_id: bill._id});
                const arrayProducts = Object.entries(searchBill.products);
                for(let i=0; i< arrayProducts.length; i++){
                    let productId = searchBill.products[i].product.idproduct;
                    let quantity = searchBill.products[i].product.quantity;
                    let searchProduct = await Product.findOne({_id: productId}).lean();
                    let stock = searchProduct.stock;
                    let sales = searchProduct.sales;
                    let productUpdate = await Product.findOneAndUpdate({_id: productId}, {stock:(stock - quantity), sales:(sales + quantity)}, {new:true});
                }
                    return res.send({bill, message:'Bill created'});
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//Función en la que el admin puede buscar las facturas de un usuario mediante el id del usuario
exports.getBillsByAdmin = async(req, res) =>{
    try {
        const userId = req.params.id;
        const bills = await Bill.find({user: userId});
        if(Object.entries(bills).length === 0){
            return res.status(404).send({message:'Bills not found'});
        }else{
            return res.send({bills});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//Función en la que el administrador busca una factura por medio del id
exports.getBillByAdmin = async(req, res) =>{
    try {
        const billId = req.params.id;
        const bill = await Bill.findOne({_id: billId});
        if(Object.entries(bill).length === 0){
        return res.status(404).send({message:'Bill not found'});
        }else{ 
            return res.send({bill});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

//Función en la que el usuario busca una factura por medio del id
exports.getBillByUser = async(req, res) =>{
    try {
        const billId = req.params.id;
        const bill = await Bill.findOne({_id: billId});
        if(Object.entries(bill).length === 0){
            return res.status(404).send({message:'Bill not found'});
        }else{
            return res.send({bill});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getBillsByUser = async(req, res) =>{
    try {
        const userId = req.user.sub;
        const bills = await Bill.find({user: userId});
        if(Object.entries(bills).length === 0){
            return res.status(404).send({message:'Bills not found'});
        }else{
            return res.send({bills});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}