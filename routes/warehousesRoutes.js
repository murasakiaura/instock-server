const express = require('express');
const router = express.Router();
const knex = require('../knexfile');

// DELETE /api/warehouses/:id
router.delete('/:id', async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouse = await knex('warehouses').where('id', warehouseId).first();

    if (!warehouse) {
      return res.status(404).send({
        message: "Warehouse not found",
      });
    }

    // Delete the warehouse with the associated inventories
    await knex('warehouses')
      .where('id', warehouseId)
      .del();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting warehouse",
    });
  }
});

module.exports = router;