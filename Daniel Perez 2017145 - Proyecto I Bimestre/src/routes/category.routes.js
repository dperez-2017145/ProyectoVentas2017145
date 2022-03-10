'use strict'

const categoryController = require('../controllers/category.controller');
const express = require('express');
const api = express.Router(); //poder crear rutas
const mdAuth = require('../services/authenticaded');

api.get('/test', categoryController.testCategory);
api.post('/saveCategory',[mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.saveCategory);
api.put('/updateCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.updateCategory);
api.delete('/deleteCategory/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], categoryController.deleteCategory);

api.get('/getCategories', mdAuth.ensureAuth, categoryController.getCategories);

module.exports = api;