const app = require('../src/app');
const knex = require('knex');
const {
    getLogins,
    makeUsersArray,
    cleanTables,
} = require('./test-helpers');

describe(`Auth Endpoint`, () => {
    
    let db;
    const carriersToTest = 1; //must be between 0 - 2, as there are three testers
    const users = makeUsersArray();
    const userToLogin = getLogins()[carriersToTest];

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

    afterEach('cleanup', () => {
        return cleanTables(db);
    })

    after(`disconnect from database`, () => {
        return db.destroy();
    })

    describe(`POST /api/auth/login`, ()=>{
        context(`Happ Path`, () => {
            it(`responds 200, and returns a jwt authtoken`, () => {
                return request(app)
                    .post('/api/auth/login')
                    .send(userToLogin)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('authToken');
                    });
            });
        })

        context(`Invalid Logins`, () => {
            it(`responds 400, Incorrect Username, when incorrect username is provided`, () => {
                const invalidUsername = {
                    username: 'Invalid username',
                    password: 'password'
                }
                return request(app)
                    .post('/api/auth/login')
                    .send(invalidUsername)
                    .expect(400, {
                        error: {
                            message: "Incorrect Username"
                        }
                    })

            })

            it(`responds 400, Incorrect Password, when there is correct username but incorrect password`, () => {
                const invalidPassword = {
                    username: userToLogin.username,
                    password: 'Invalid Password'
                }
                return request(app)
                    .post('/api/auth/login')
                    .send(invalidPassword)
                    .expect(400, {
                        error: {
                            message: "Incorrect Password"
                        }
                    })
            })
        })
    })
})