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

describe(`Equipments Endpoint`, () => {

    let db;
    let authToken = '';
    let carrierEquipments = [];
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

    describe(`GET /api/equips`, () => {
        context(`Happy Path`, () => {
            it(`reponds 200, and returns all the equipments`, () => {
                return request(app)
                    .get('/api/equips')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200)
                    .then((res) => {
                        carrierEquipments = res.body;
                        expect(res.body).to.be.an('array');
                        if(res.body.length){
                            res.body.map((equipment) => {
                                expect(equipment).to.have.property('id');
                            })
                        }
                    });
            })
        })
    })

    describe(`POST /api/equips`, () => {

        const newEquipment = {
            unit_num: '1234',
            status: 'active'
        }

        context(`Input Validation`, () => {

            it(`responds 400, when the unit number is not provided`, () => {
                const equipmentWithInvalidUnitNum = {
                    ...newEquipment,
                    unit_num: ''
                }

                return request(app)
                    .post('/api/equips')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(equipmentWithInvalidUnitNum)
                    .expect(400, {
                        error: {
                            message: `Unit Number is required for equipment`
                        }
                    })
            })

            it(`reponds 400, when the status is not one of active/inactive`, () => {
                const equipmentWithInvalidStatus = {
                    ...newEquipment,
                    status: 'Invalid Status'
                }

                return request(app)
                    .post('/api/equips')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(equipmentWithInvalidStatus)
                    .expect(400, {
                        error: {
                            message: `Status can be either active for inactive`
                        }
                    })
            })
        })

        context(`Happy Path`, () => {
            it(`responds 200, and adds the equipment with an id`, () => {
                return request(app)
                    .post('/api/equips')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newEquipment)
                    .expect(201)
                    .then((res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.unit_num).to.eql(newEquipment.unit_num);
                        expect(res.body.status).to.eql(newEquipment.status);
                    })
            })
        })
    })

    describe('GET /api/equips/:id', () => {
        context(`Happy Path`, () => {
            it(`responds 200, and returns an equipment whose id is in params`, () => {
                const idOfEquipment = carrierEquipments[0].id;
                return request(app)
                    .get(`/api/equips/${idOfEquipment}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.body.id).to.eql(idOfEquipment);
                        expect(res.body.unit_num).to.eql(carrierEquipments[0].unit_num);
                        expect(res.body.status).to.eql(carrierEquipments[0].status);
                    })
            })
        })
    })

    describe(`PATCH /api/equips/:id`, () => {
        context(`Happy Path`, () => {
            it(`responds 201, and updates the equipment with new fields`, () => {
                const equipmentToUpdate = carrierEquipments[0];
                const newFields = {
                    ...equipmentToUpdate,
                    status: equipmentToUpdate.status === 'active' ? 'inactive' : 'active',
                    unit_num: 'test changed'
                }

                return request(app)
                    .patch(`/api/equips/${equipmentToUpdate.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newFields)
                    .expect(201)
                    .then((res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.body.id).to.eql(newFields.id);
                        expect(res.body.status).to.eql(newFields.status);
                        expect(res.body.carrier_id).to.eql(carriersToTest+1);
                        expect(res.body.status).to.eql(newFields.status);
                        expect(res.body.unit_num).to.eql(newFields.unit_num);
                    })
            })
        })
    })

})