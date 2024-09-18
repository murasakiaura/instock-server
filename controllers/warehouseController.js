const Joi = require("joi");
const knex = require("knex")(require("../knexfile"));

const updateWarehouseDetails = async (req, res) => {
  try {
    const warehouseId = parseInt(req.params.id);

    if (!warehouseId || isNaN(warehouseId)) {
      return res.status(400).json({ message: "Invalid warehouse ID." });
    }

    const warehouseSchema = Joi.object({
      warehouse_name: Joi.string().required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      country: Joi.string().required(),
      contact_name: Joi.string().required(),
      contact_position: Joi.string().required(),
      contact_phone: Joi.string()
        .pattern(/^\+?[0-9\s-().]*$/)
        .required(),
      contact_email: Joi.string().email().required(),
    });

    const { error } = warehouseSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }

    const warehouseExists = await knex("warehouses")
      .where("id", warehouseId)
      .first();
    if (!warehouseExists) {
      return res.status(404).json({ message: "Warehouse not found." });
    }

    const updateCount = await knex("warehouses")
      .where("id", warehouseId)
      .update(req.body);

    if (updateCount === 0) {
      return res.status(500).json({
        message: "Update failed: No changes made or warehouse not found.",
      });
    }

    const updatedWarehouse = await knex("warehouses")
      .where("id", warehouseId)
      .first();

    res.status(200).json({
      message: "Warehouse updated successfully",
      data: updatedWarehouse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating warehouse: ${error.message}` });
  }
};

module.exports = {
  updateWarehouseDetails,
};
