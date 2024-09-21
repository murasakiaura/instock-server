<<<<<<< HEAD
const express = require('express')
const cors = require('cors');
const inventoriesRoutes = require('./routes/inventoriesRoutes');
const app = express()
const port = 3000
=======
const express = require("express");
const app = express();
const cors = require("cors");
const inventoriesRoutes = require("./routes/inventoriesRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const port = process.env.PORT || 3000;
>>>>>>>>> Temporary merge branch 2

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

<<<<<<< HEAD
// Routes 
app.use('/inventories/:warehouse_id', inventoriesRoutes);
=======
// Routes
app.use("/api/inventories", inventoriesRoutes);
app.use("/api/warehouses", warehouseRoutes);
>>>>>>> 23222c399f2863fefddda719c897a996ae1d976d


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
