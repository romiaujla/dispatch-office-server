const express = require('express');
const carrierRouter = express.Router();
const CarrierService = require('./carriers-service');
const { jwtAuth } = require('../middleware/jwt-auth');
const AuthService = require('../auth/auth-service');

carrierRouter
    .route('/carrier')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        CarrierService.getCarrierData(db, carrier_id)
            .then((carrierData) => {
                if(!carrierData){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Carrier Data could not be retrieved`
                            }
                        })
                } 
                
                return res
                    .status(200)
                    .json(carrierData);
            })
            .catch((error) => {
                next(error);
            })
    });

carrierRouter
    .route('/loads')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        
        CarrierService.getLoads(db, carrier_id)
            .then((loads) => {
                if (!loads) {
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Loads could not be found at this time, please try again later`
                            }
                        })
                } else if (loads.length === 0) {
                    return res
                        .status(404)
                        .json({
                            error: {
                                message: `Carrier has no loads`
                            }
                        })
                }

                return res
                    .status(200)
                    .json(loads);
            })
            .catch((error) => {
                next(error);
            })
    })


module.exports = carrierRouter;