const ShipmentsService = {
  updateShipment(db, id, newFields, carrier_id) {
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
  }
};

module.exports = ShipmentsService;
