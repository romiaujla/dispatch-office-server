const ShipmentsService = {
  updateShipment(db, id, newFields, carrier_id) {
    console.log(newFields);
    return db("shipments")
      .where({ id })
      .andWhere({ carrier_id })
      .update(newFields);
  },
  insertShipment(db, newShipment) {
    return db("shipments")
      .insert(newShipment)
      .returning("*")
      .then(rows => rows[0]);
  },
  deleteShipment(db, id, carrier_id) {
    return db("shipments")
      .where({ id })
      .andWhere({ carrier_id })
      .delete();
  },
  getWarehouses(db, id, carrier_id){
    return db
      .select(
        'pickup_warehouse',
        'delivery_warehouse'
      )
      .from('shipments')
      .where({ id })
      .andWhere({ carrier_id })
      .first()
  }
};

module.exports = ShipmentsService;
