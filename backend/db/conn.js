const mongoose = require("mongoose");
require('dotenv').config();

const DB = process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Error:", err));

module.exports = mongoose.connection;
