import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is obligatory"],
    unique: true
  },
  description: {
    type: String,
    required: [true, "description is obligatory"]
  },
  price: {
    type: Number,
    required: [true, "price is obligatory"],
  },
  stock: {
    type: Number,
    default: 0,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Product", ProductSchema);
