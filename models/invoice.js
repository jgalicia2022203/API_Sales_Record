const { Schema, model } = require("mongoose");

const InvoiceSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});

module.exports = model("Invoice", InvoiceSchema);
