
const express = require("express");
const router = express.Router();
const {
  createNewInventory,
  getAllInventoryItems,
  updateInventoryByWarehouseId,
} = require("../controllers/inventoriesControllers");

router.post("/", createNewInventory);
router.put("/:inventory_id", updateInventoryByWarehouseId);
router.get('/', getAllInventoryItems);



module.exports = router;
