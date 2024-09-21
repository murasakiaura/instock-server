
const express = require("express");
const router = express.Router();
const {
  createNewInventory,
  getAllInventoryItems,
  updateInventoryByWarehouseId,
  getWarehouseInventories,
} = require("../controllers/inventoriesControllers");

router.post("/", createNewInventory);
router.put("/:inventory_id", updateInventoryByWarehouseId);
router.get('/', getAllInventoryItems);
router.get('/:warehouse_id', getWarehouseInventories);


module.exports = router;
