'use strict'

const Product = require('../models/product.model');
const Category = require('../models/category.model');

const {validateData, searchProduct} = require('../utils/validate');

exports.testProduct = (req, res)=>{
    res.send({message: 'The function test is running'});
}

exports.saveProduct = async(req, res) =>{
    try {
        const params = req.body;
        const data = {
            nameProduct: params.nameProduct,
            price: params.price,
            stock: params.stock,
            sales: 0,
            category: params.category
        }

        const msg = await validateData(data);
        if(msg) return res.status(400).send(msg);
        else{
            const productExist = await searchProduct(params.nameProduct);
            if(productExist) return res.send({message:'The product already exist'});
            else{
                if(params.stock < 0)
                return res.send({message: 'Negatives are disabled'});
                else{
                    const product = new Product(data);
                    await product.save();
                    return res.send({message:'Product created'});
                }
            }
        }
    
    }catch (err) {
        console.log(err);
        return err;
    }
    
}


exports.updateProduct = async(req, res) =>{
    try {
        const productId = req.params.id;
        const params = req.body;
        const productUpdate = await Product.findOneAndUpdate({_id: productId}, params, {new:true}).lean();
            return res.send({productUpdate, message:'Product updated'});
    } catch (err) {
        console.log(err);
        return err;
    }
    
}

exports.deleteProduct = async(req, res) =>{
    try {
        const productId = req.params.id;
        const productDeleted = await Product.findOneAndDelete({_id: productId});
        if(!productDeleted) return res.status(404).send({message:'Product not found'});
        else return res.send({message:'Product deleted'});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getProducts = async(req, res) =>{
    try {
        const products = await Product.find()
        .populate('category').lean();
        return res.send({products});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.getProduct = async(req, res) =>{
    try {
        const productId = req.params.id;
        const product = await Product.findOne({_id: productId});
        if(!product) return res.status(404).send({message:'Product not found'});
        else return res.send({product});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.soldOut = async(req, res) =>{
    try {
        const soldOutProducts = await Product.find({stock:0});
        if(soldOutProducts == 0) return res.send({message:'All products have stock'});
        else return res.send(soldOutProducts);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.MostSale = async(req, res) =>{
    try {
        const productsMostSale = await Product.find().sort({sales:-1});
        return res.send({productsMostSale});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.searchProducts = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            nameProduct: params.nameProduct
        };
        const msg = validateData(data);
        if(!msg){
            const product = await Product.find({nameProduct: {$regex:params.nameProduct, $options: 'i'}});
            return res.send({product});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchProductsByCategory = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            nameCategory: params.nameCategory
        };
        const msg = validateData(data);
        if(!msg){
            const productOfCategory = await Product.find({nameCategory: {$regex:params.nameCategory, $options:'i'}}).populate('category').lean();
            return res.send({productOfCategory});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}