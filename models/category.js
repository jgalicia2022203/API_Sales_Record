const { Schema, model } = require("mongoose");

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
  },
  description: {
    type: String,
    required: [true, "Category description is required"],
  },
});

module.exports = model("Category", CategorySchema);
