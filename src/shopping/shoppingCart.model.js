import mongoose from "mongoose";

const { Schema } = mongoose;

const ShoppingCartSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("ShoppingCart", ShoppingCartSchema);
