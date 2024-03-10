const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const areaRoutes = require("./routes/route.areas.js");

app.use("/api", areaRoutes);

const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const mongoDB = "mongodb://127.0.0.1:27017/epicPorject";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to MongoDB.");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});