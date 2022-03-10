'Use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    nameProduct: String,
    price: Number,
    stock: Number,
    sales: Number,
    category: {type: mongoose.Schema.ObjectId, ref: 'Category'}

});

module.exports = mongoose.model('Product', productSchema);