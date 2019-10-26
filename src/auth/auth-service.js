const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const AuthService = {
    getUserWithUserNAme(db, username){
        return db('carriers')
            .where({ username })
            .first();
    },
    comparePassword(password, hash){
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload){
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256',
        })
    },
    verifyJwt(token){
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },
}

module.exports = AuthService;