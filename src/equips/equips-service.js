const EquipmentService = {
    getEquipments(db, carrier_id){
        return db
            .from('equipments as eq')
            .select(
                'eq.id',
                'eq.unit_num',
                'eq.status',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                          'id', dr.id,
                          'full_name', dr.full_name,
                          'pay_rate', dr.pay_rate,
                          'status', dr.status
                        )
                      ) AS "equipment"`
                )
            )
            .leftJoin(
                'drivers as dr',
                'eq.id',
                'dr.equipment_id'
            )
            .where(
                'eq.carrier_id',
                carrier_id
            )
    }
}

module.exports = EquipmentService;