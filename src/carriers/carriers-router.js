const express = require('express');
const carrierRouter = express.Router();
const CarrierService = require('./carriers-service');

carrierRouter
    .route('/loads')
    .get((req, res, next) => {
        const db = req.app.get('db');
        CarrierService.getLoads(db, 1)
            .then((loads) => { 
                console.log(loads);
            })
        res.send(`GET /api/loads data`);
    })


module.exports = carrierRouter;