const knex = require('knex');
const app = require('../src/app');
const {
    cleanTables,
    makeUsersArray,
    makeEquipmentsArray,
    makeDriversArray,
    makeShipmentsArray,
    makeWarehousesArray,
    getLogins,
} = require('./test-helpers');

describe(`Drivers Endpoint`, () => {

    let db;
    let driversForCarrier = [];
    let authToken = '';
    const carriersToTest = 1; //must be between 0 - 2, as there are three testers
    const users = makeUsersArray();
    const userToLogin = getLogins()[carriersToTest];
    const warehouses = makeWarehousesArray();
    const equipments = makeEquipmentsArray();
    const drivers = makeDriversArray();
    const shipments = makeShipmentsArray();

    before(`make knex instance`, () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db);
    })

    before('cleanup', () => {
        return cleanTables(db);
    });

    beforeEach('add carriers', () => {
        return db('carriers')
            .insert(users);
    })

    beforeEach('add warehouses', () => {
        return db('warehouses')
            .insert(warehouses);
    })

    beforeEach('add equipments', () => {
        return db('equipments')
            .insert(equipments);
    })

    beforeEach('add drivers', () => {
        return db('drivers')
            .insert(drivers);
    })

    beforeEach('add shipments', () => {
        return db('shipments')
            .insert(shipments);
    })

    beforeEach('get Auth token', (done) => {
        request(app)
            .post('/api/auth/login')
            .send(userToLogin)
            .then((res) => {
                authToken = res.body.authToken;
                done();
            })
    })

    afterEach('cleanup', () => {
        return cleanTables(db);
    })

    after(`disconnect from database`, () => {
        return db.destroy();
    })

    describe(`GET /api/drivers`, () => {

        it(`responds 200, returns the carriers data`, () => {  
            return request(app)
                .get('/api/drivers')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    driversForCarrier = res.body;
                    if(res.body.length){
                        res.body.map((driver) => {
                            expect(driver).to.have.property('equipment');
                            expect(driver.equipment).to.be.an('object');
                        })
                    }
                })
        })
    })

    describe(`POST /api/drivers`, () => {

        const newDriver = {
            full_name: 'Driver 22',
            pay_rate: 0.50,
            equipment_id: 11,
            status: 'active',
            carrier_id: carriersToTest+1
        };

        context(`Input Validation`, () => {
            it(`responds 400, if full name of driver is missing`, () => {
                const driverWithNoName = {
                    ...newDriver,
                    full_name: ''
                }
    
                return request(app)
                    .post('/api/drivers')
                    .send(driverWithNoName)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400, {
                        error: {
                            message: `Full Name is required`
                        }
                    })
            })
    
            it(`responds 400, when pay rate is non numeric`, () => {
                const driverWithInvalidPay = {
                    ...newDriver,
                    pay_rate: 'invalid pay'
                }
    
                return request(app)
                    .post('/api/drivers')
                    .send(driverWithInvalidPay)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400, {
                        error: {
                            message: `Pay Rate can only be numeric`
                        }
                    })
    
            })

            it(`responds 400, when equiment is non numeric`, () => {
                const driverWithInvalidEquipmentID = {
                    ...newDriver,
                    equipment_id: 'invalid equipment id',
                }

                return request(app)
                    .post('/api/drivers')
                    .send(driverWithInvalidEquipmentID)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400, {
                        error: {
                            message: `Equipment id can only be numeric`
                        }
                    })

            })

            it(`reponds 400, if status is not one of active or inactive`, () => {
                const driverWithInvalidStatus = {
                    ...newDriver,
                    status: 'invalid status'
                }

                return request(app)
                    .post('/api/drivers')
                    .send(driverWithInvalidStatus)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400, {
                        error: {
                            message: `Status can only be either active or inactive`
                        }
                    })
            })
        })

        context(`Happy Path`, () => {
            it(`responds with 201, and returns the new driver with an id`, () => {
                return request(app)
                .post('/api/drivers')
                .send(newDriver)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(201)
                .then((res) =>{ 
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.full_name).to.eql(newDriver.full_name)
                    expect(parseFloat(res.body.pay_rate)).to.eql(parseFloat(newDriver.pay_rate))
                    expect(res.body.equipment_id).to.eql(newDriver.equipment_id)
                    expect(res.body.carrier_id).to.eql(newDriver.carrier_id)
                })
            })
        })
    })


    
    describe(`PATCH /api/drivers/:id`, () => {
        context(`Happy Path`, () => {
            it(`responds 201, and updates the driver with the new fields`, () => {
                const driverToPatch = driversForCarrier[0];
                const newFields = {
                    full_name : driverToPatch.full_name,
                    pay_rate: 0.0,
                    equipment_id: driverToPatch.equipment.id,
                    status: driverToPatch.status === 'active' ? 'inactive' : 'active'
                }

                return request(app)
                    .patch(`/api/drivers/${driverToPatch.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newFields)
                    .expect(201)
                    .then(() => {
                        return request(app)
                            .get('/api/drivers')
                            .set('Authorization', `Bearer ${authToken}`)
                            .expect(200)
                            .then((res) => {
                                const updatedDriver = res.body.filter(driver => driver.id === driverToPatch.id)[0]
                                expect(updatedDriver.full_name).to.eql(newFields.full_name);
                                expect(parseFloat(updatedDriver.pay_rate)).to.eql(parseFloat(newFields.pay_rate));
                                expect(updatedDriver.equipment.id).to.eql(newFields.equipment_id);
                                expect(updatedDriver.status).to.eql(newFields.status);
                            })
                    });
            })
        })
    })
    
})