const Joi = require("joi");
const knex = require("knex")(require("../knexfile"));
const constants = require("../constants");

const createNewWarehouse = async (req, res) => {
  try {
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

    const { error } = warehouseSchema.validate(req.body, {
      abortEarly: false,
    });

    // Handle validation errors
    if (error) {
      return res.status(400).send({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    // check if  warehouse_id all ready exist in warehouse
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;

    // Create a new warehouse item when db is ready
    const createNewWarehouse = await knex("warehouses").insert({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });

    if (createNewWarehouse.length === 0)
      return res.status(500).send({
        message:
          "Unable to create new warehouse at the moment. Please try again later.",
      });

    const [newWarehouseId] = createNewWarehouse;
    const newWarehouse = await knex("warehouses")
      .where({ id: newWarehouseId })
      .first();

    res.status(201).json({
      message: "Warehouse created successfully",
      data: newWarehouse,
    });
  } catch (err) {
    res.status(400).send(`Error Creating Warehouse : ${err}`);
  }
};

// DELETE /api/warehouses/:id
const deleteWarehouse = async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouse = await knex("warehouses").where("id", warehouseId).first();

    if (!warehouse) {
      return res.status(404).send({
        message: "Warehouse not found",
      });
    }

    // Delete the warehouse with the associated inventories

    const resFromDelete = await knex("warehouses")
      .where("id", warehouseId)
      .del();

    if (!resFromDelete)
      return res.status(500).send({
        message: "Warehouse Deleted unsuccessfully. try again later",
      });

    return res.status(201).send({
      message: "Warehouse Deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting warehouse",
    });
  }
};


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

// Get all Warehouses
const getAllWarehouses = async (req, res) => {
  try {
    const allWarehouses = await knex(constants.knex.warehouses);
    if (allWarehouses.length === 0) {
      return res.status(200).json({ message: "No warehouses found" });
    }
    res.status(200).json(allWarehouses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch warehouses" });
  }
};

// Get a single warehouse
const getSingleWarehouse = async (req, res) => {
  const { id } = req.params;
  try {
    const warehouse = await knex(constants.knex.warehouses)
      .where({ id })
      .first();
    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  updateWarehouseDetails,
  getAllWarehouses,
  getSingleWarehouse,
  createNewWarehouse,
  deleteWarehouse,
};
