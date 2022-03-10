'Use strict'

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    nameCategory: String,
    
});

module.exports = mongoose.model('Category', categorySchema);