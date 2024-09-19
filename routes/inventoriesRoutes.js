const express = require("express");
const router = express.Router();
const {
  createNewInventory,
  updateInventoryByWarehouseId,
} = require("../controllers/inventoriesControllers");

router.post("/", createNewInventory);
router.put("/:inventory_id", updateInventoryByWarehouseId);

module.exports = router;
