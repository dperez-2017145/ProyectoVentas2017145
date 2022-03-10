'use strict'

const billController = require('../controllers/bill.controller');
const express = require('express');
const api = express.Router(); //poder crear rutas
const mdAuth = require('../services/authenticaded');

api.get('/createBill', [mdAuth.ensureAuth, mdAuth.isClient], billController.createBill);
api.get('/getBillByAdmin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.getBillByAdmin);
api.get('/getBillsByAdmin/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], billController.getBillsByAdmin);
api.get('/getBillByUser/:id', [mdAuth.ensureAuth, mdAuth.isClient], billController.getBillByUser);
api.get('/getBillsByUser', [mdAuth.ensureAuth, mdAuth.isClient], billController.getBillsByUser);
module.exports = api;