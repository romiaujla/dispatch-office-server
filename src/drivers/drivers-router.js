const express = require("express");
const DriverService = require("./drivers-service");
const driverRouter = express.Router();
const { jwtAuth } = require("../middleware/jwt-auth");
const bodyParser = express.json();
const { validateDriver } = require("./drivers-validation");

driverRouter
  .route("/")
  .all(jwtAuth)
  .get((req, res, next) => {
    const db = req.app.get("db");
    const carrier_id = req.carrier.id;
    DriverService.getDrivers(db, carrier_id)
      .then(drivers => {
        if (!drivers) {
          return res.status(400).json({
            error: {
              message: `Bad request for getting drivers`
            }
          });
        }

        return res.status(200).json(drivers);
      })
      .catch(err => {
        next(err);
      });
  });

driverRouter
  .route("/idle")
  .all(jwtAuth)
  .get((req, res, next) => {
    const db = req.app.get("db");
    const carrier_id = req.carrier.id;
    DriverService.getIdleDrivers(db, carrier_id)
      .then(idleDrivers => {
        if (!idleDrivers) {
          return res.status(400).json({
            error: {
              message: `Bad request to get Idle Drivers`
            }
          });
        }
        return res.status(200).json(idleDrivers);
      })
      .catch(err => {
        next(err);
      });
  });

driverRouter
  .route("/:id")
  .all(jwtAuth)
  .patch(bodyParser, validateDriver, (req, res, next) => {
    const db = req.app.get("db");
    const carrier_id = req.carrier.id;
    const { id } = req.params;

    const newFields = {
      full_name: req.body.full_name,
      pay_rate: req.body.pay_rate,
      equipment_id: req.body.equipment_id,
      status: req.body.status
    };

    DriverService.updateDrivers(db, id, newFields, carrier_id)
      .then(updatedDriver => {
        if (!updatedDriver) {
          return res.status(400).json({
            error: {
              message: `Could not update driver`
            }
          });
        }

        return res.status(201).end();
      })
      .catch(err => {
        next(err);
      });
  });

module.exports = driverRouter;
