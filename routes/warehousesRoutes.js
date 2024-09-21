const express = require("express");
const router = express.Router();
const knex = require("../knexfile");
const { createNewWarehouse, deleteWarehouse } = require("../controllers/warehousesController");

router.post("/warehouse", createNewWarehouse);
router.delete("/api/warehouses/:id", deleteWarehouse);

module.exports = router;
