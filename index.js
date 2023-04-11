const express = require("express");
const app = express();
const restaurants = require('./routes/restaurants');

app.use(express.json());
app.use("/", restaurants);

const server = app.listen(3000, () => {
  console.log("Server started on port 3000");
});