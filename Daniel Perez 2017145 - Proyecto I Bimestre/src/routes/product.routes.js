'use strict'

const productController = require('../controllers/product.controller');
const express = require('express');
const api = express.Router(); //poder crear rutas
const mdAuth = require('../services/authenticaded');

api.get('/testProduct', productController.testProduct);

//ADMINS
api.post('/saveProduct', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.saveProduct);
api.put('/updateProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.updateProduct);
api.delete('/deleteProduct/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], productController.deleteProduct);

//EVERYONE
api.get('/getProducts', mdAuth.ensureAuth, productController.getProducts);
api.get('/getProduct/:id', mdAuth.ensureAuth, productController.getProduct);
api.get('/soldOut', mdAuth.ensureAuth, productController.soldOut);
api.get('/mostSale', mdAuth.ensureAuth, productController.MostSale);
api.post('/searchProducts', mdAuth.ensureAuth, productController.searchProducts);
api.post('/searchproductsByCategory', mdAuth.ensureAuth, productController.searchProductsByCategory);

module.exports = api;