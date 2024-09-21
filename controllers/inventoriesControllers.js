const Joi = require("joi");
const knex = require("knex")(require("../knexfile"));
const constants = require("../constants");

// POST -- Create New InveNtory of Warehouse by its ID
const createNewInventory = async (req, res) => {
  try {
    // inventorySchema for req body validations
    const inventorySchema = Joi.object({
      warehouse_id: Joi.number().integer().strict().positive().required(),
      item_name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().valid("IN STOCK", "OUT OF STOCK").required(),
      quantity: Joi.number().integer().strict().required(),
    });

    const { error } = inventorySchema.validate(
      //convert status from REQ BODY to lowerCase to pass Validation
      { ...req.body, status: req.body.status.toUpperCase() },
      {
        abortEarly: false,
      }
    );

    // Handle validation errors
    if (error) {
      return res.status(400).send({
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    // check if  warehouse_id all ready exist in warehouse
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    const warehouseAllReadyExist = await knex(constants.knex.warehouses).where(
      "id",
      warehouse_id
    );
    if (warehouseAllReadyExist.length === 0)
      return res.status(400).send({
        message:
          "The warehouse you're trying to add inventory to does not exist. Please add the warehouse first.",
      });

    // Create a new inventory item when db is ready
    const createNewInventory = await knex(constants.knex.inventories).insert({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    if (createNewInventory.length === 0)
      return res.status(500).send({
        message:
          "Unable to create new inventory at the moment. Please try again later.",
      });

    const [newInventoryId] = createNewInventory;
    const newInventory = await knex(constants.knex.inventories)
      .where({ id: newInventoryId })
      .first();

    res.status(201).json({
      message: "Inventory created successfully",
      data: newInventory,
    });
  } catch (err) {
    res.status(400).send(`Error Creating  Inventory : ${err}`);
  }
};

//Get all inventory items

const getAllInventoryItems = async (req, res) => {
  try {
    const allInventoryItems = await knex(constants.knex.inventories)
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );
    if (allInventoryItems.length === 0) {
      return res.status(200).json({ message: "Currently, inventory is empty" });
    }
    res.status(200).json(allInventoryItems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all inventory items" });
  }
};

//GET Inventories for a Given Warehouse

const getWarehouseInventories = async (req, res) => {
  const warehouseId = req.params.warehouse_id;

  try {
    const givenWarehouse = await knex(constants.knex.warehouses)
      .where({ id: warehouseId })
      .first();

    if (!givenWarehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    const givenWarehouseInventories = await knex(
      constants.knex.inventories
    ).where({ warehouse_id: warehouseId });

    res.status(200).json(givenWarehouseInventories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT----Update Inventory of Warehouse by Warehouse_id and inventory_id
const updateInventoryByWarehouseId = async (req, res) => {
  try {
    const { inventory_id } = req.params;

    // inventorySchema for req body validations
    const inventorySchema = Joi.object({
      warehouse_id: Joi.number().integer().strict().positive().required(),
      item_name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().valid("IN STOCK", "OUT OF STOCK").required(),
      quantity: Joi.number().integer().strict().required(),
    });
    const { error } = inventorySchema.validate(
      //convert status from REQ BODY to lowerCase to pass Validation
      { ...req.body, status: req.body.status.toUpperCase() },
      {
        abortEarly: false,
      }
    );
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // check if  warehouse_id all ready exist in warehouse
    const { warehouse_id } = req.body;

    const warehouseAllReadyExist = await knex(constants.knex.warehouses).where(
      "id",
      warehouse_id
    );

    if (warehouseAllReadyExist.length === 0)
      return res.status(400).send({
        message:
          "The warehouse you're trying to update inventory for  does not exist. Please add the warehouse first.",
      });

    const checkInventoryExist = await knex(constants.knex.inventories).where(
      "id",
      inventory_id
    );

    if (checkInventoryExist.length === 0)
      return res.status(404).send({
        message:
          "The inventory does not exist. Please add the inventory first.",
      });

    const updateInventory = await knex(constants.knex.inventories)
      .where("id", inventory_id)
      .update(req.body);

    if (updateInventory === 0) {
      return res
        .status(400)
        .send({ message: "Inventory not updated try again later " });
    }

    const getNewInventory = await knex(constants.knex.inventories)
      .where("id", inventory_id)
      .first();

    res.status(200).json({
      message: "Inventory",
      data: getNewInventory,
    });
  } catch (error) {
    res.status(500).send(`Error updating  Inventory : ${error}`);
  }
};

const getInventoryById = async (req, res) => {
  try {
    const { inventory_id } = req.params;
    const inventory = await knex(constants.knex.inventories)
      .where("inventories.id", inventory_id)
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .first();

    if (!inventory)
      return res.status(404).send({ message: "Inventory not found" });

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).send(`Error Getting   Inventory : ${error}`);
  }
};

// DELETE /api/inventories/:id
const deleteInventoryById = async (req, res) => {
  const inventoryId = req.params.id;

  try {
    const resFromDelete = await knex('inventories')
      .where('id', inventoryId)
      .del();

    if (resFromDelete === 0) {
      return res.status(404).send({
        message: "Inventory not found.",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error deleting inventory.",
    });
  }
};

module.exports = {
  createNewInventory,
  getAllInventoryItems,
  updateInventoryByWarehouseId,
  getWarehouseInventories,
  getInventoryById,
  deleteInventoryById,
};
