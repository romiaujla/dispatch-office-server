const express = require('express');
const authRouter = express.Router();
const jsonParser = express.json();
const AuthService = require('./auth-service');

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const {username, password} = req.body;
        const loginUser = {
            username, 
            password
        }
        console.log(loginUser);

        for(const [key, value] of Object.entries(loginUser)){
            if(value == null){
                return res
                    .status(400)
                    .json({
                        error: {
                            message: `Missing ${key} in request body`
                        }
                    });
            }
        }

        AuthService.getUserWithUserNAme(
            req.app.get('db'),
            loginUser.username
        )
            .then((dbCarrier) => {
                if(!dbCarrier){
                    return res
                        .status(400)
                        .json({
                            error: {
                                message: `Incorrect Username`
                            }
                        })
                }

                return AuthService.comparePassword(
                    loginUser.password,
                    dbCarrier.password   
                )
                    .then(compareMatch => {
                        if(!compareMatch){
                            return res
                                .status(400)
                                .json({
                                    error: {
                                        message: `Incorrect Password`
                                    }
                                })
                        }

                        const sub = dbCarrier.username
                        const payload = {
                            carrier_id: dbCarrier.id
                        }

                        res.send({
                            authToken: AuthService.createJwt(
                                sub,
                                payload
                            )
                        })
                    })
            })
            .catch(next)

    });

module.exports = authRouter