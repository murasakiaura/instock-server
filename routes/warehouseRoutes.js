const router = require("express").Router();
const {
  updateWarehouseDetails,
  getAllWarehouses,
  getSingleWarehouse,
  createNewWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");

router.put("/:id", updateWarehouseDetails);
router.get("/", getAllWarehouses);
router.get("/:id", getSingleWarehouse);

router.post("/", createNewWarehouse);
router.delete("/:id", deleteWarehouse);

module.exports = router;
