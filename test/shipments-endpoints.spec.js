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
    splitArrayWithComma,
} = require('./test-helpers');

describe(`Shipments Endpoint`, () => {

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

    describe(`POST /api/shipments`, () => {

        const newShipment = {
            rate: 100,
            status: 'dispatched',
            miles: 1000, 
            driver_id: 2, 
            broker: 'Test Broker',
            pickup_date: '01/20/2020',
            delivery_date: '01/20/2020',
            carrier_id: 1,
            pickup_city: 'Test Pickup City',
            pickup_state: 'ST',
            pickup_zipcode: '123456',
            delivery_city: 'Test Delivery City',
            delivery_state: 'ST',
            delivery_zipcode: '123457',
        }
        
        context(`Input Validation`, () => {

            const inputNegativeFields = ['rate', 'miles'];
            const inputInvalidDates = ['pickup_date', 'delivery_date'];
            const statusArray = [
                'un-assigned',
                'dispatched',
                'loading',
                'in transit',
                'unloading',
                'completed',
            ]

            for(let field of inputNegativeFields){
                it(`responds 400, if ${field} is a negative number`, () => {
                    let shipmentWithNegativeNumbers = {
                        ...newShipment
                    }
                    shipmentWithNegativeNumbers[field] = -10
                    
                    // capitalizing field
                    field = field[0].toUpperCase() + field.slice(1, field.length);

                    return request(app)
                        .post('/api/shipments')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(shipmentWithNegativeNumbers)
                        .expect(400, {
                            error: {
                                message: `${field} must be a positive and a numeric value`
                            }
                        })

                })
            }

            it(`reponds 400, if status is not one of ${splitArrayWithComma(statusArray)}`, () => {
                const shipmentWithInvalidStatus = {
                    ...newShipment, 
                    status: 'Invalid Status'
                }

                return request(app)
                    .post('/api/shipments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(shipmentWithInvalidStatus)
                    .expect(400, {
                        error: {
                            message: `Status can only be one of ${splitArrayWithComma(statusArray)}`
                        }
                    })
            })

            for(const field of inputInvalidDates){
                const outputField = field[0].toUpperCase() + field.slice(1, field.length).split('_').join(' ');
                it(`reponds 400, if the ${outputField} is in invalid format`, () => {
                    let shipmentWithInvalidDate = {
                        ...newShipment
                    }
                    shipmentWithInvalidDate[field] = 'Invalid Date'
                    return request(app)
                        .post('/api/shipments')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(shipmentWithInvalidDate)
                        .expect(400, {
                            error: {
                                message: `${outputField} is not a valid date`
                            }          
                        })
                })
            }
            
            const missingFields = [
                'pickup_state', 
                'pickup_city', 
                'pickup_zipcode',
                'delivery_zipcode',
                'delivery_city',
                'delivery_state'
            ]
            for(const field of missingFields){
                const outputField = field[0].toUpperCase() + field.slice(1, field.length).split('_').join(' ');
                it(`reponds 400, when ${outputField} is missing`, () => {
                    const shipmentWithMissingField = {
                        ...newShipment
                    }
                    delete shipmentWithMissingField[field]

                    return request(app)
                        .post('/api/shipments')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(shipmentWithMissingField)
                        .expect(400, {
                            error: {
                                message: `${outputField} is required`
                            }          
                        })
                })
            }
        })

        context(`Happy Path`, () => {
            it(`reponds 201, adds the new shipment and returns it with the a new id`, () => {
                return request(app)
                    .post('/api/shipments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(newShipment)
                    .expect(201)
                    .then((res) => {
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(parseFloat(res.body.rate)).to.eql(parseFloat(newShipment.rate));
                        expect(res.body.status).to.eql(newShipment.status); 
                        expect(parseFloat(res.body.miles)).to.eql(parseFloat(newShipment.miles));
                        expect(res.body.broker).to.eql(newShipment.broker);
                        expect(res.body.driver_id).to.eql(newShipment.driver_id);
                        expect(new Date(res.body.pickup_date)).to.eql(new Date(newShipment.pickup_date));
                        expect(new Date(res.body.delivery_date)).to.eql(new Date(newShipment.delivery_date));
                        expect(res.body).to.have.property('pickup_warehouse');
                        expect(res.body).to.have.property('delivery_warehouse');
                        expect(res.body.carrier_id).to.eql(carriersToTest+1);
                    })
            })
        })

    })
})