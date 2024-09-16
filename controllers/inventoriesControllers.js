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
const createNewInventory = async (req, res) => {
  try {
    // inventorySchema for req body validations
    const inventorySchema = Joi.object({
      warehouse_id: Joi.number().integer().strict().positive().required(),
      item_name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().valid("in stock", "out of stock").required(),
      quantity: Joi.number().integer().strict().positive().required(),
    });

    const { error } = inventorySchema.validate(
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

    // Create a new inventory item when db is ready
    const createNewInventory = await knex("inventories")
      .insert({
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
    const newInventory = await knex("inventories")
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

module.exports = {
  createNewInventory,
};
