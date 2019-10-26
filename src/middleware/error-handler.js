const { NODE_ENV } = require('../config');

function errorHandler(error, req, res, next) {
    let response = {};
    console.log(error);
    if (NODE_ENV === 'production') {
        response = {
            error: `Server Error`
        }
    } else {
        response = {
            error: error.message,
            object: error
        }
    }

    res
        .status(500)
        .json(response);
}

module.exports = errorHandler;