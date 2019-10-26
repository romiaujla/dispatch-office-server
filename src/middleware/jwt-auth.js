const AuthService = require('../auth/auth-service');

function jwtAuth(req, res, next) {

    const authToken = req.get('Authorization');

    let jwtToken = '';

    if (!authToken.toLowerCase().startsWith(`bearer `)) {
        return res
            .status(400)
            .json({
                error: `Missing bearer token`
            });
    } else {
        jwtToken = authToken.slice(`bearer `.length, authToken.length);
    }

    try {

        const { sub } = AuthService.verifyJwt(jwtToken);

        AuthService.getUserWithUserName(
            req.app.get('db'),
            sub
        )
        .then((carrier) => {
            if(!carrier){
                return res
                    .status(401)
                    .json({
                        error: {
                            message: `Unauthorized Request`
                        }
                    })
            }
            
            req.carrier = carrier;
            next();    
        })
    } catch (error) { 
        res
            .status(401)
            .json({
                error: {
                    message: `Unauthorized Request`
                }
            })
    }
}

module.exports = {
    jwtAuth,
}