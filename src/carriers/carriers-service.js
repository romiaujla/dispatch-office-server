const CarrierService = {
    getCarrierData(db, carrier_id){
        return db
            .from('shipments as ship')
            .select (
                'ship.id',
                'ship.rate',
                'ship.status',
                'ship.miles',
                'ship.broker',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                          'id', dr.id,
                          'full_name', dr.full_name,
                          'pay_rate', dr.pay_rate,
                          ${db.raw(
                              `json_strip_nulls(
                                json_biuld_object(
                                    'id', eq.id,
                                    'unit_num', eq.unit_num
                                )
                              ) AS "equipment"`
                          )},
                          'status', dr.status
                        )
                      ) AS "driver"`
                ),
                'ship.pickup_date',
                'ship.pickup_warehouse',
                'ship.delivery_date',
                'ship.delivery_warehouse',
            )
            .leftJoin(
                'carriers as usr',
                'usr.id',
                'ship.carrier_id'
            )
            .leftJoin(
                'drivers as dr',
                'dr.id',
                'ship.driver_id'
            )
            .leftJoin(
                'equipments as eq',
                'eq.id',
                'dr.id'
            )
            .where(
                `ship.carrier_id`,
                carrier_id
            );
    },

}

module.exports = CarrierService;