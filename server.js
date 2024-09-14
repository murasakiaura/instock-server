const express = require('express')
const cors = require('cors');
const inventoriesRoutes = require('./routes/inventoriesRoutes');
const app = express()
const port = 3000

// Middleware
app.use(express.json()) 
app.use(cors()); 
app.use(express.static('public'))





app.get('/', (req, res) => {
  res.send('Hello World!')
});


// Routes 
app.use('/inventories/:warehouse_id', inventoriesRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})