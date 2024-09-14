const Joi = require("joi");
const { v4: uuidv4 } = require('uuid');
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
      warehouse_id: Joi.required(),
      item_name: Joi.string().required(),
      description: Joi.string().required(),
      category: Joi.string().required(),
      status: Joi.string().valid("in stock", "out of stock").required(),
      quantity: Joi.number().integer().positive().required(),
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

    // Create a new inventory item when db is ready
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;
    // check if  warehouse_id all ready exist in warehouse
    // Duplicate Inventory for the Same Warehouse

    // save into db
    // const result = await knex("inventory").insert(
    //   warehouse_id,
    //   item_name,
    //   description,
    //   category,
    //   status,
    //   quantity
    // );
    res.json({ message: req.body });
  } catch (err) {
    res.status(400).send(`Error Creating  Inventory : ${err}`);
  }
};

module.exports = {
  createNewInventory,
};
