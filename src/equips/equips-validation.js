function equipmentFieldsValidation(fields, res){
    
    const {unit_num, status} = fields;

    if(!unit_num){
        return res
            .status(400)
            .json({
                error: {
                    message: `Unit Number is required for equipment`
                }
            })
    }

    if(unit_num.trim() === ''){
        return res
            .status(400)
            .json({
                error: {
                    message: `Unit Number is required for equipment`
                }
            })
    }

    if(!['active', 'inactive'].includes(status)){
        return res
            .status(400)
            .json({
                error: {
                    message: `Status can be either active for inactive`
                }
            })
    }

}

module.exports = {
    equipmentFieldsValidation
};