const xss = require('xss');
const Treeize = require('treeize');

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
                      ) AS "driver"`
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
    },
    getEquipmentById(db, id, carrier_id){
        return db('equipments')
            .where({ id })
            .andWhere({ carrier_id })            
            .first();
    },
    updateEquipment(db, id, newFields, carrier_id){
        return db('equipments')
            .where({ id })
            .andWhere({ carrier_id })
            .update(newFields);
    },
    insertEquipment(db, newEquipment){
        return db('equipments')
            .insert(newEquipment)
            .returning('*')
            .then((rows)=>rows[0]);
    },
    serializeEquipments(equipments){
        return equipments.map(this.serializeEquipment);
    },
    serializeEquipment(equipment){
        const equipmentTree = new Treeize();

        const equipmentData = equipmentTree.grow([equipment]).getData()[0];

        return {
            id: equipmentData.id,
            unit_num: xss(equipmentData.unit_num),
            carrier_id: equipmentData.carrier_id,
            status: equipmentData.status
        }
    },
    serializeEquipmentsDriver(equipments){
        return equipments.map(this.serializeEquipmentDriver);
    },
    serializeEquipmentDriver(equipment){
        const equipmentTree = new Treeize();

        const equipmentData = equipmentTree.grow([equipment]).getData()[0];

        return {
            id: equipmentData.id,
            unit_num: xss(equipmentData.unit_num),
            carrier_id: equipmentData.carrier_id,
            status: equipmentData.status,
            driver: {
                id: equipmentData.driver.id,
                full_name: xss(equipmentData.driver.full_name),
                pay_rate: xss(equipmentData.driver.pay_rate),
                status: equipmentData.driver.status
            }
        }
    }
}

module.exports = EquipmentService;