const express = require("express");
const app = express();
const cors = require("cors");
const inventoriesRoutes = require("./routes/inventoriesRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const port = process.env.PORT || 3000;


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/inventories", inventoriesRoutes);
app.use("/api/warehouses", warehouseRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
