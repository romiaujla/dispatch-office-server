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

        let {
            pickup_date, 
            delivery_date
        } = req.body




        res.send(`Pickup date: ${pickup_date}, Delivery date: ${delivery_date}`);
    })

module.exports = shipmentsRouter;