function validateDriver(req, res, next){
    
    const {full_name, pay_rate, equipment_id } = req.body

    if(full_name === '' || full_name === null){
        return res
            .status(400)
            .json({
                error: {
                    message: `Full Name is required`
                }
            })
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

    next();
}

module.exports = {
    validateDriver,
}