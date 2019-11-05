function validateNewDriverFields(fields, res){
    
    const {full_name, pay_rate, equipment_id } = fields

    if(full_name === ''){
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

}

module.exports = {
    validateNewDriverFields,
}