-- SELECT 
--     dr.full_name
--     FROM
--     shipments ship
--     RIGHT JOIN
--     drivers dr
--     ON
--     dr.id = ship.driver_id
--     WHERE
--     ship.carrier_id = 1
--     AND 
--     ship.status <> 'completed';

-- query to get idle driver
SELECT 
    *
    FROM
    drivers dr
    WHERE
    dr.carrier_id = 1
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
        ship.carrier_id = 1
        AND 
        ship.status <> 'completed'
    );

-- SELECT 
--         dr.full_name,
--         eq.unit_num
--         FROM
--         shipments ship
--         RIGHT JOIN
--         drivers dr
--         ON
--         dr.id = ship.driver_id
--         LEFT JOIN
--         equipments eq
--         ON
--         dr.equipment_id = eq.id
--         WHERE
--         ship.carrier_id = 1
--         AND 
--         ship.status <> 'completed'