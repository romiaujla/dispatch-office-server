const express = require('express');
const carrierRouter = express.Router();
const CarrierService = require('./carriers-service');
const { jwtAuth } = require('../middleware/jwt-auth');

carrierRouter
    .route('/loads')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        CarrierService.getLoads(db, 1)
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
    })


module.exports = carrierRouter;