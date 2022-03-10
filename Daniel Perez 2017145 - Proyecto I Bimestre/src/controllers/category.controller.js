'use strict'

const Category = require('../models/category.model');
const Product = require('../models/product.model');

const {validateData, searchCategory} = require('../utils/validate');

exports.testCategory = (req, res)=>{
    res.send({message: 'The function test is running'});
}

exports.saveCategory = async(req, res)=>{
    try {
        const params = req.body;
        const data = {
            nameCategory: params.nameCategory
        }
        const msg = validateData(data);
        if(msg){
            return res.status(400).send(msg);
        }else{
            const categoryExist = await searchCategory(params.nameCategory);
            if(categoryExist){
                return res.send({message: 'The category already exist'});
            }else{
                const category = new Category(data);
                await category.save();
                return res.send({message:'Category created'})
            }
        }

    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateCategory = async(req, res) => {
    try{
        const categoryId = req.params.id;
        const params = req.body;
        const data = {
            nameCategory: params.nameCategory
        }
        const msg = await validateData(data);
        if(!msg){
            const categoryExist = await searchCategory(params.nameCategory);
            if(!categoryExist){
                const categoryUpdate = await Category.findOneAndUpdate({_id: categoryId}, params, {new:true}).lean();
                return res.send({categoryUpdate, message:'Category updated'});
            }else{
                return res.send({message: 'The category already exist'});
            }
        }else{
            return res.status(400).send(msg); 
        }
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.getCategories = async(req, res)=>{
    try {
        const categories = await Category.find();
        return res.send({categories});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.deleteCategory = async(req, res)=>{
    try {
        const categoryId = req.params.id;
        const searchCategory = Category.findOne({_id: categoryId});
        if(searchCategory && searchCategory.nameCategory !== 'Default'){
            const productsFound = await Product.find({categoryId: categoryId}).lean();
            if(Object.entries(productsFound).length === 0){
                const categoryDelete = await Category.findOneAndDelete({_id: categoryId});
                return res.send({message:'Category deleted'});
            }else{
                const productsUpdated = await Product.updateMany({category: categoryId}, {$set: {category: '6227f6d606ff7b6e427993b5'}});
                const categoryDeleted = await Category.findOneAndDelete({_id: categoryId});
                return res.send({message:'Category deleted'});
            }
        }else{
            return res.status(400).send({message:'Category not found'});
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}