const router = require("express").Router();
const { createNewInventory } = require("../controllers/inventoriesControllers");

router.post("/", createNewInventory);

module.exports = router;
