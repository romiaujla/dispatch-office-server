const express = require('express');
const EquipmentService = require('./equips-service');
const equipsRouter = express.Router();
const { jwtAuth } = require('../middleware/jwt-auth');

equipsRouter
    .route('/')
    .all(jwtAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        EquipmentService.getEquipments(db, carrier_id)
            .then((equipments) => {
                if(!equipments){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Could not get equipments`
                            }
                        })
                }

                console.log(equipments);

                res
                    .status(200)
                    .json(equipments);
            })
    })

module.exports = equipsRouter;