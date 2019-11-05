function validateDriver(req, res, next){
    
    const {full_name, pay_rate, equipment_id, status } = req.body

    if(full_name){
        if(full_name.trim() === '' || full_name === null){
            return res
                .status(400)
                .json({
                    error: {
                        message: `Full Name is required`
                    }
                })
        }
    }

    if(pay_rate && isNaN(pay_rate)){
        return res
            .status(400)
            .json({
                error: {
                    message: `Pay Rate can only be numeric`
                }
            })
    }

    if(equipment_id && isNaN(equipment_id)){
        return res
            .status(400)
            .json({
                error: {
                    message: `Equipment id can only be numeric`
                }
            })
    }

    if(status){
        if(!['active', 'inactive'].includes(status)){
            return res
                .status(400)
                .json({
                    error: {
                        message: `Status can only be either active or inactive`
                    }
                })
        }
    }

    next();
}

function checkRequiredFields(req, res, next){
    const { full_name } = req.body
    if(!full_name){
        return res
            .status(400)
            .json({
                error: {
                    message: `Full Name is required`
                }
            })
    }

    next();
}

module.exports = {
    validateDriver,
    checkRequiredFields,
}