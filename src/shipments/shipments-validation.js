function validateShipment(req, res, next){
    
    const {
        rate, 
        status, 
        miles, 
        driver_id, 
        pickup_date,
        delivery_date,
        pickup_city,
        delivery_city,
        pickup_state,
        delivery_state,
        pickup_zipcode,
        delivery_zipcode
    } = req.body

    const statusArray = [
        'un-assigned',
        'dispatched',
        'loading',
        'in transit',
        'unloading',
        'completed'
    ]

    if(rate){
        if(isPositiveNumber(rate)){
            return response(res, 400, `Rate must be a positive and a numeric value`)
        }
    }

    if(miles){
        if(isPositiveNumber(miles)){
            return response(res, 400, `Miles must be a positive and a numeric value`)
        }
    }

    if(driver_id){
        if(isPositiveNumber(driver_id)){
            return response(res, 400, `Driver id must be a positive integer`)
        }
    }

    if(!statusArray.includes(status)){
        return response(res, 400, `Status can only be one of ${splitArrayWithComma(statusArray)}`)
    }

    if(notValidDate(pickup_date)){
        return response(res, 400, `Pickup date is not a valid date`)
    }

    if(notValidDate(delivery_date)){
        return response(res, 400, `Delivery date is not a valid date`)
    }

    if(isEmpty(pickup_city)){
        return response(res, 400, `Pickup City cannot be empty spaces`)
    }

    if(isEmpty(delivery_city)){
        return response(res, 400, `Delivery City cannot be empty spaces`)
    }

    if(isEmpty(pickup_state) || pickup_state.trim().length !== 2){
        return response(res, 400, `Pickup state must be exactly two characters`)
    }

    if(isEmpty(delivery_state) || delivery_state.trim().length !== 2){
        return response(res, 400, `Delivery state must be exactly two characters`)
    }

    if(isEmpty(delivery_zipcode)){
        return response(res, 400, `Delivery zipcode is cannot be empty spaces`)
    }

    if(isEmpty(pickup_zipcode)){
        return response(res, 400, `Pickup zipcode is cannot be empty spaces`)
    }

    next();
}

function isEmpty(str){
    return str.trim() === '';
}

function notValidDate(date){
    const date_regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(15|18|17|16|19|20|21|23|24|25)\d{2}$/ ;
    return date.length < 8 || !date_regex.test(date);
}

function isPositiveNumber(num){
    return isNaN(num) && num > 0;
}

function response(res, status, error){
    return res
        .status(status)
        .json({
            error: {
                message: error
            }
        })
}

function splitArrayWithComma(arr){
    let [lastWord, ...restOftheArray] = [
        arr.pop(),
        ...arr
    ]
    return `${restOftheArray.join(', ')} and ${lastWord}`;
}

function checkRequiredFields(req, res, next){
    const {
        status,  
        pickup_date,
        delivery_date,
        pickup_city,
        delivery_city,
        pickup_state,
        delivery_state,
        pickup_zipcode,
        delivery_zipcode
    } = req.body

    if(!status){
        return response(res, 400, `Status is required`)
    } 
    if(!pickup_date){
        return response(res, 400, `Pickup date is required`)
    }
    
    if(!delivery_date){
        return response(res, 400, `Delivery date is required`)
    }

    if(!pickup_city){
        return response(res, 400, `Pickup city is required`)
    }

    if(!delivery_city){
        return response(res, 400, `Delivery city is required`)
    }

    if(!pickup_state){
        return response(res, 400, `Pickup state is required`)
    }

    if(!delivery_state){
        return response(res, 400, `Delivery state is required`)
    }

    if(!pickup_zipcode){
        return response(res, 400, `Pickup zipcode is required`)
    }

    if(!delivery_zipcode){
        return response(res, 400, `Delivery zipcode is required`)
    }

    next();
}

module.exports = {
    validateShipment,
    checkRequiredFields,
}