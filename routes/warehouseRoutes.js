const router = require("express").Router();
const {
  updateWarehouseDetails,
  getAllWarehouses,
  getSingleWarehouse
} = require("../controllers/warehouseController");

router.put("/:id", updateWarehouseDetails);
router.get('/', getAllWarehouses);
router.get('/:id', getSingleWarehouse);

module.exports = router;
