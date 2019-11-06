const express = require('express');
const ShipmentsService = require('./shipments-service');
const shipmentsRouter = express.Router();
const { jwtAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();
const {
    validateShipment,
    checkRequiredFields,
} = require('./shipments-validation');

shipmentsRouter
    .route('/')
    .post(jsonParser, checkRequiredFields, validateShipment, (req, res, next) => {
        res.send('ok');
    })

module.exports = shipmentsRouter;