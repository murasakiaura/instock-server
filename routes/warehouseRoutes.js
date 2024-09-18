const router = require("express").Router();
const {
  updateWarehouseDetails,
  getAllWarehouses
} = require("../controllers/warehouseController");

router.put("/:id", updateWarehouseDetails);
router.get('/', getAllWarehouses);

module.exports = router;
