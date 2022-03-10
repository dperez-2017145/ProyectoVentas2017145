'use strict'

const userController = require('../controllers/user.controller');
const express = require('express');
const api = express.Router(); //poder crear rutas
const mdAuth = require('../services/authenticaded');

api.get('/test', userController.test);
//rutas públicas
api.post('/register', userController.register);
api.post('/login', userController.login);

//rutas privadas 
api.put('/update/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.delete);

//rutas para los administradores
api.put('/updateRole/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.updateRole);
api.put('/updateByAdmin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.updateUserByAdmin);
api.delete('/deleteByAdmin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.deleUserByAdmin);
module.exports = api;