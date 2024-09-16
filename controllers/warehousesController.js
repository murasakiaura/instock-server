const Joi = require("joi");
const knex = require("knex")(require("../knexfile"));

// {
//     "warehouse_id": 1,
//     "item_name": "Paper Towels",
//     "description": "Made out of military-grade synthetic materials, these paper towels are highly flammable, yet water resistant, and easy to clean.",
//     "category": "Gear",
//     "status": "Out of Stock",
//     "quantity": 0
//   }

// POST -- Create New InveNtory of Warehouse by its ID
const createNewWarehouse = async (req, res) => {
  try {
    // inventorySchema for req body validations
    const warehouseSchema = Joi.object({
      warehouse_name: Joi.string().required(),
      address: Joi.string().required(),
      contact_name: Joi.string().required(),
      contact_information: Joi.string().required(),
      actions: Joi.string().required().required(),
    });

    const { error } = warehouseSchema.validate(
      //convert status from REQ BODY to lowerCase to pass Validation
      { ...req.body, status: req.body.status.toLowerCase() },
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

    const warehouseAllReadyExist = await knex("warehouses").where(
      "id",
      warehouse_id
    );
    if (warehouseAllReadyExist.length === 0)
      return res.status(400).send({
        message:
          "The warehouse you're trying to add inventory to does not exist. Please add the warehouse first.",
      });

    // Create a new warehouse item when db is ready
    const createNewWarehouse = await knex("warehouses").insert({
      warehouse_name,
      address,
      contact_name,
      contact_information,
      actions,
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
    await knex("warehouses").where("id", warehouseId).del();

    return res.status(204).send({
      message: "Warehouse Deleted successfully.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error deleting warehouse",
    });
  }
};

module.exports = { createNewWarehouse, deleteWarehouse };
