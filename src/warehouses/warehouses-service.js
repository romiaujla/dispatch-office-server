const WarehousesService = {
    updateWarehouse(db, id, newFields, carrier_id){
        console.log(newFields);
        return db('drivers')
            .where({ id })
            .andWhere({ carrier_id })
            .update(newFields);
    },
    insertWarehouse(db, newWarehouse){
        return db('drivers')
            .insert(newWarehouse)
            .returning('*')
            .then((rows)=>rows[0]);
    }
}

module.exports = WarehousesService;