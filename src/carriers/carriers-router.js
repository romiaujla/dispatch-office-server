const express = require('express');
const carrierRouter = express.Router();
const CarrierService = require('./carriers-service');
const { jwtAuth } = require('../middleware/jwt-auth');
const { formatDate } = require('../helper/helper');

carrierRouter
    .route('/carrier')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        CarrierService.getCarrierData(db, carrier_id)
            .then((carrierData) => {
                if (!carrierData) {
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Carrier Data could not be retrieved`
                            }
                        })
                }

                carrierData.map((shipment) => {
                    shipment.pickup_date = formatDate(shipment.pickup_date)
                    shipment.delivery_date = formatDate(shipment.delivery_date)
                })

                return res
                    .status(200)
                    .json(carrierData);
            })
            .catch((error) => {
                next(error);
            })
    });

carrierRouter
    .route('/carrier-info')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const { id } = req.carrier;
        CarrierService.getCarrierInfo(db, id)
            .then((carrier) => {
                if (!carrier) {
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Carrier Information could not be received`
                            }
                        })
                }

                return res
                    .json(carrier);
            })
            .catch((error) => {
                next(error);
            })
    })

carrierRouter
    .route('/drivers')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        CarrierService.getDrivers(db, carrier_id)
            .then((drivers) => {
                if (!drivers) {
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

carrierRouter
    .route('/equipments')
    .all(jwtAuth)
    .get((req, res, next) => {

    })

module.exports = carrierRouter;