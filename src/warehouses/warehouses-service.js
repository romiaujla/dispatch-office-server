const WarehouseService = {
    updateWarehouse(db, id, newFields, carrier_id){
        console.log(newFields);
        return db('warehouses')
            .where({ id })
            .andWhere({ carrier_id })
            .update(newFields);
    },
    insertWarehouse(db, city, state, zipcode){
        const newWarehouse = {
            city,
            state,
            zipcode
        }
        return db('warehouses')
            .insert(newWarehouse)
            .returning('*')
            .then((rows)=>rows[0]);
    },
    getWarehouse(db, city, state, zipcode){
        return db('warehouses')
            .where({ city })
            .andWhere({ state })
            .andWhere({ zipcode })
            .first();
    }
}

module.exports = WarehouseService;