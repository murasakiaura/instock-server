const express = require("express");
const cors = require("cors");
//const commentsRouter = require('./routes/comments.js');
//const usersRouter = require('./routes/users.js');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use((req, res, next) => {
  console.log("Welcome to InStock!");

  next();
});

app.use((req, res, next) => {
  console.log("Welcome to InStock!!!");
  next();
});

// CORS middleware

app.get("/", (req, res) => {
  res.send("HEEEEEEEELLLLO");
});

//app.use('/comments', commentsRouter);
//app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
