import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, "name is obligatory"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "description is obligatory"],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Category", CategorySchema);
