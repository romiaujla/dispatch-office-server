const express = require('express');
const driverRouter = express.Router();
const DriverService = require('./drivers-service');
const { jwtAuth } = require('../middleware/jwt-auth');

driverRouter
    .route('/')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        DriverService.getDrivers(db, carrier_id)
            .then((drivers) => {
                if(!drivers){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Could not retrieve drivers`
                            }
                        })
                }
                return res
                    .status(200)
                    .json(drivers);
            })
            .catch((error) => {
                next(error);
            })
    })

module.exports = driverRouter;