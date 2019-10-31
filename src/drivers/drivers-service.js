const DriverService = {
    getDrivers(db, carrier_id){
        return db
            .from('drivers as dr')
            .select(
                'dr.id',
                'dr.full_name',
                'dr.pay_rate',
                'dr.status',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                            'id', eq.id,
                            'unit_num', eq.unit_num,
                            'status', eq.status
                        )
                    )  AS "equipment"`
                )
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
    getIdleDrivers(db, carrier_id){
        const query = `SELECT 
        dr.id,
        dr.full_name,
        dr.pay_rate,
        dr.status,
        json_strip_nulls(
            json_build_object(
                'id', eq.id,
                'unit_num', eq.unit_num,
                'status', eq.status
            )
        ) AS "equipment"
        FROM
        drivers dr
        LEFT JOIN
        equipments eq
        ON
        dr.equipment_id = eq.id
        WHERE
        dr.carrier_id = ${carrier_id}
        AND 
        dr.status = 'active'
        AND dr.id NOT IN (
            SELECT 
            dr.id
            FROM
            shipments ship
            RIGHT JOIN
            drivers dr
            ON
            dr.id = ship.driver_id
            WHERE
            ship.carrier_id = ${carrier_id}
            AND 
            ship.status <> 'completed'
        )`
        return db
            .raw(query)
            .then((data) => {
                return data.rows;
            });
    }
}

module.exports = DriverService;