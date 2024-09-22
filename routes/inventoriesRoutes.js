
const express = require("express");
const router = express.Router();
const {
  createNewInventory,
  getAllInventoryItems,
  updateInventoryByWarehouseId,
  getWarehouseInventories,
  getInventoryById,
  deleteInventoryById,
} = require("../controllers/inventoriesControllers");

router.post("/", createNewInventory);
router.put("/:inventory_id", updateInventoryByWarehouseId);
router.get('/', getAllInventoryItems);
router.get('/:warehouse_id/inventories', getWarehouseInventories);
router.get("/:inventory_id", getInventoryById);
router.delete('/:id', deleteInventoryById);


module.exports = router;
