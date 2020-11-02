const mongoose = require("mongoose");

let todoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  created_on: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Todo", todoSchema);
