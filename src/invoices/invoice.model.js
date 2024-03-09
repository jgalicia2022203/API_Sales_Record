import mongoose from "mongoose";

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is obligatory"],
  },
  shopping: {
    type: Schema.Types.ObjectId,
    ref: "ShoppingCart",
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  items: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Canceled"],
    default: "Pending",
  },
});

export default mongoose.model("Invoice", InvoiceSchema);
