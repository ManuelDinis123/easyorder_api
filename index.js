const express = require("express");
const app = express();
const restaurants = require('./routes/restaurants');
const auth = require('./routes/auth');

app.set("view engine", "html");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use("/", restaurants);
app.use("/dev/", auth);

const server = app.listen(3000, '10.0.2.11', () => {
  console.log("Server started on port 3000");
});