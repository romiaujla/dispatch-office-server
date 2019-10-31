const express = require('express');
const DriverService = require('./driver-service');
const driverRouter = express.Router();
const {jwtAuth} = require('../middleware/jwt-auth');


driverRouter
    .route('/')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db')
        const carrier_id = req.carrier.id;
        DriverService.getDrivers(db, carrier_id)
            .then((drivers) => {
                if(!drivers){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Bad request for getting drivers`
                            }
                        })
                }

                return res
                    .status(200)
                    .json(drivers)
            })
            .catch((err) => {
                next(err);
            })
    })

driverRouter
    .route('/idle')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db')
        const carrier_id = req.carrier.id;
        DriverService.getIdleDrivers(db, carrier_id)
            .then((idleDrivers) => {
                if(!idleDrivers){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Bad request to get Idle Drivers`
                            }
                        })
                }

                return res
                    .status(200)
                    .json(idleDrivers)
            })
    })

module.exports = driverRouter;