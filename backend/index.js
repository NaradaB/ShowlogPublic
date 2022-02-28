const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

require("dotenv").config();

const db = require("./models");

// Routers
const userRouter = require("./routes/Users");
const showRouter = require("./routes/Shows");
app.use("/users", userRouter);
app.use("/shows", showRouter);

db.sequelize.sync().then(() => {
  app.listen(6969, () => {
    console.log("Server is now running!");
  });
});
