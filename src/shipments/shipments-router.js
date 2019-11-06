const express = require('express');
const ShipmentsService = require('./shipments-service');
const shipmentsRouter = express.Router();
const { jwtAuth } = require('../middleware/jwt-auth');
const jsonParser = express.json();
const {
    validateShipment,
    checkRequiredFields,
} = require('./shipments-validation');
const WarehouseService = require('../warehouses/warehouses-service');

shipmentsRouter
    .route('/')
    .all(jwtAuth)
    .post(jsonParser, checkRequiredFields, validateShipment, async (req, res, next) => {

        const db = req.app.get('db');
        const carrier_id = req.carrier.id;

        let {
            pickup_date, 
            delivery_date
        } = req.body

        // `Replacing '/' backslashes to '-' dashes for date to be stored in correct
        // form in the database`
        pickup_date = pickup_date.replace(/\//g,'-');
        delivery_date = pickup_date.replace(/\//g,'-');

        let newShipment = {
            rate: req.body.rate || 0.0, 
            status: req.body.status, 
            miles: req.body.miles || 0, 
            driver_id: req.body.driver_id || null, 
            broker: req.body.broker || null,
            pickup_date,
            delivery_date,
            carrier_id,
        }

        
        const {
            pickup_city,
            pickup_state,
            pickup_zipcode,
            delivery_city,
            delivery_state,
            delivery_zipcode
        } = req.body
        
        // get warehouse if it already exists, else create a new one
        
        let pickup_warehouse = await getWarehouseId(
            db,
            pickup_city,
            pickup_state,
            pickup_zipcode
        )

        let delivery_warehouse = await getWarehouseId(
            db,
            delivery_city,
            delivery_state,
            delivery_zipcode
        )

        newShipment = {
            ...newShipment,
            pickup_warehouse,
            delivery_warehouse
        }

        ShipmentsService.insertShipment(db, newShipment)
            .then((addedShipment) => {
                if(!addedShipment){
                    return res
                        .json({

                        })
                }
            })

        res.json(newShipment);
    })

async function getWarehouseId(db, city, state, zipcode){
    const warehouse = await WarehouseService.getWarehouse(db, city, state, zipcode)
            .then(async (foundWarehouse) => {
                // if did not find warehouse then create a new one
                if(!foundWarehouse){
                    return await WarehouseService.insertWarehouse(db, city, state, zipcode)
                    .then((addedWarehouse) => {
                        return addedWarehouse;    
                    })
                    .catch(err => {
                        next(err)
                    })
                }
                return foundWarehouse
            })
            .catch(err => {
                next(err)
            })

    return warehouse.id;
}

module.exports = shipmentsRouter;