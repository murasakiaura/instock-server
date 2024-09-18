const router = require("express").Router();
const {
  updateWarehouseDetails,
} = require("../controllers/warehouseController");

router.put("/:id", updateWarehouseDetails);

module.exports = router;
