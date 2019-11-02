const express = require('express');
const EquipmentService = require('./equips-service');
const equipsRouter = express.Router();
const { jwtAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();
const {
    equipmentFieldsValidation
} = require('./equips-validation');

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

                res
                    .status(200)
                    .json(EquipmentService.serializeEquipmentsDriver(equipments));
            })
    })
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        const {
            unit_num,
            status = 'active',
        } = req.body

        // Validation
        equipmentFieldsValidation({unit_num, status})

        const newEquipment = {
            unit_num,
            status,
            carrier_id
        }

        EquipmentService.insertEquipment(db, newEquipment)
            .then((equipment) => {
                if(!equipment){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Could not insert equipment`
                            }
                        })
                }
                return res
                    .status(200)
                    .json(EquipmentService.serializeEquipment(equipment))
            })
    })

equipsRouter
    .route('/:id')
    .all(jwtAuth)
    .get((req, res, next) => {
        const {id} = req.params;
        const db = req.app.get('db');
        const carrier_id = req.carrier.id;
        EquipmentService.getEquipmentById(db, id, carrier_id)
            .then((equipment) => {
                if(!equipment){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Equipment Not Found`
                            }
                        })
                }
                return res
                    .status(200)
                    .json(EquipmentService.serializeEquipment(equipment));
            })
    })
    .patch(jsonParser, (req, res, next) => {
        const {id} = req.params;
        const db = req.app.get('db');
        const {
            unit_num,
            status = 'active',
        } = req.body;
        const carrier_id = req.carrier.id;

        // Validation
        equipmentFieldsValidation({unit_num, status})

        const newEquipment = {
            unit_num,
            status
        }

        EquipmentService.updateEquipment(db, id, newEquipment, carrier_id)
            .then((updatedEquipment) => {
                if(!updatedEquipment){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Request Could not be completed`
                            }
                        })
                }

                EquipmentService.getEquipmentById(db, id, carrier_id)
                    .then((equipment) => {
                        if(!equipment){
                            return res
                            .status(400)
                            .json({
                                error: {
                                    message: `Request Could not be completed`
                                }
                            })
                        }

                        return res
                            .status(201)
                            .json(EquipmentService.serializeEquipment(equipment))
                    })
            })
            .catch((err) => {
                next(err);
            })
    })

module.exports = equipsRouter;