'use strict'

const cartController = require('../controllers/cart.controller');
const express = require('express');
const api = express.Router(); //poder crear rutas
const mdAuth = require('../services/authenticaded');

api.put('/addCart', [mdAuth.ensureAuth, mdAuth.isClient], cartController.updateCart);
module.exports = api;