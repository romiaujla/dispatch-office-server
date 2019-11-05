function validateEquipment(req, res, next){
    
    const {unit_num, status} = req.body;

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

    next();
}

module.exports = {
    validateEquipment
};