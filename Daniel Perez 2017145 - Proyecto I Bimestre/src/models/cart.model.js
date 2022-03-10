'use strict'

const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref:'User'}, 
    products: [{product: {
        nameProduct: String,
        quantity: Number,
        price: Number,
        idproduct: {type: mongoose.Schema.ObjectId, ref:'Product'},
        subTotal: Number
    }}],
    total: Number
})


module.exports = mongoose.model('Cart', cartSchema);