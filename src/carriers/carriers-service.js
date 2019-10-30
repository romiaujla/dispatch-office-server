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
                          'status', dr.status
                        )
                      ) AS "driver"`
                ),
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                          'id', eq.id,
                          'unit_num', eq.unit_num,
                          'status', eq.status
                        )
                      ) AS "equipment"`
                ),
                'ship.pickup_date',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                            'id', pwh.id,
                            'city', pwh.city,
                            'state', pwh.state,
                            'zipcode', pwh.zipcode
                        )
                    ) AS "pickup_warehouse"`
                ),
                'ship.delivery_date',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                            'id', dwh.id,
                            'city', dwh.city,
                            'state', dwh.state,
                            'zipcode', dwh.zipcode
                        )
                    ) AS "delivery_warehouse"`
                )
            )
            .join(
                'carriers as usr',
                'usr.id',
                'ship.carrier_id'
            )
            .leftJoin(
                'drivers as dr',
                'ship.driver_id',
                'dr.id'
            )
            .leftJoin(
                'equipments as eq',
                'dr.equipment_id',
                'eq.id'
            )
            .join(
                'warehouses as pwh',
                'ship.pickup_warehouse',
                'pwh.id'
            )
            .join(
                'warehouses as dwh',
                'ship.delivery_warehouse',
                'dwh.id'
            )
            .where(
                `ship.carrier_id`,
                carrier_id
            );
    },
    getCarrierInfo(db, id){
        return db
            .select('username', 'full_name', 'company_name', 'mc_num')
            .from('carriers')
            .where({ id });
    }

}

module.exports = CarrierService;