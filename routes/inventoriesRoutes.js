const router = require("express").Router();
const { createNewInventory,
    getAllInventoryItems,
 } = require("../controllers/inventoriesControllers");

router.post("/", createNewInventory);
router.get('/', getAllInventoryItems);

module.exports = router;
