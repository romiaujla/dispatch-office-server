const app = require('../src/app');
const knex = require('knex');
const {
    cleanTables,
    makeUsersArray,
    makeEquipmentsArray,
    makeDriversArray,
    makeShipmentsArray,
    makeWarehousesArray,
    getLogins,
} = require('./test-helpers');

describe(`Carrier Endpoint`, () => {

    let db;
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

    describe(`GET /api/carrier`, () => {

        it(`responds 200, returns the carriers data`, () => {  
            return request(app)
                .get('/api/carrier')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('array');
                    if(res.body.length){
                        res.body.map(carrierInfo => {
                            expect(carrierInfo).to.have.property('id')
                            expect(carrierInfo.driver).to.be.an('object');
                            expect(carrierInfo.equipment).to.be.an('object');
                            expect(carrierInfo).to.have.property('rate');
                            expect(carrierInfo).to.have.property('miles');
                            expect(carrierInfo).to.have.property('broker');
                            expect(carrierInfo).to.have.property('pickup_date');
                            expect(carrierInfo).to.have.property('pickup_warehouse');
                            expect(carrierInfo).to.have.property('delivery_date');
                            expect(carrierInfo).to.have.property('delivery_warehouse');
                        })
                    }
                });
            
        })
    })

    describe(`GET /api/carrier-info`, () => {

        it(`responds 200, returns the logged in carriers info`, () => {
            return request(app)
                .get('/api/carrier-info')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .then((res) => {                    
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.eql(1);
                    res = res.body[0];
                    expect(res).to.have.property('username');
                    expect(res).to.have.property('full_name');
                    expect(res).to.have.property('company_name');
                    expect(res).to.have.property('mc_num');
                })
        })
    })

    describe(`GET /api/drivers`, () => {
        it(`responds 200, returns all the drivers for the logged in carrier`, () => {
            return request(app)
                .get('/api/drivers')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    if(res.body.length){
                        res.body.map((driver) => {
                            expect(driver).to.have.property('equipment');
                            expect(driver.equipment).to.be.an('object');
                        })
                    }
                })
        })
    })

})