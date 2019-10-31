const DriverService = {
    getDrivers(db, carrier_id) {
        return db
            .from('drivers as dr')
            .select(
                'dr.id',
                'dr.full_name',
                'dr.pay_rate',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                          'id', eq.id,
                          'unit_num', eq.unit_num,
                          'status', eq.status
                        )
                      ) AS "equipment"`
                ),
                'dr.status'
            )
            .leftJoin(
                'equipments as eq',
                'dr.equipment_id',
                'eq.id'
            )
            .where(
                'dr.carrier_id',
                carrier_id
            )
    },
}

module.exports = DriverService;