const CarrierService = {
    getLoads(db, carrier_id){
        return db('shipments')
            .where({ carrier_id });
    },
}

module.exports = CarrierService;