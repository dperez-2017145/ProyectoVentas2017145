'use strict'

//const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const {validateData} = require('../utils/validate');

exports.updateCart = async(req, res) =>{
    try {
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            nameProduct: params.nameProduct,
            quantity: params.quantity
        }
        const msg = validateData(data);
        if(msg){
            return res.send(msg);
        }else{
            const searchProduct = await Product.findOne({nameProduct:params.nameProduct});
            if(searchProduct){
                if(params.quantity > searchProduct.stock){
                    res.send({message:'There is no stock of this product'});
                }else{
                    const cartUpdated = await Cart.findOneAndUpdate({user: userId}, {$push:{products: [{product:{idproduct:searchProduct._id, nameProduct:params.nameProduct, price: searchProduct.price, quantity: params.quantity, subTotal:(searchProduct.price * params.quantity)}}]}}, {new:true});
                    const searchCart = await Cart.findOne({user: userId}).lean();
                    const arrayCart = Object.entries(searchCart.products);
                    let total = 0;
                    for(let i=0; i< arrayCart.length; i++){
                        total = total + searchCart.products[i].product.subTotal;
                    }
                    const cartUpdateTotal = await Cart.findOneAndUpdate({user: userId}, {total:total}, {new:true});
                    return res.send({cartUpdateTotal, message:'Added Products'});
                }
            }else{
                res.send({message:'Product not found'});
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}