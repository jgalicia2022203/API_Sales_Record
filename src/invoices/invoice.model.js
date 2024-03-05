import mongoose from 'mongoose';

const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  invoiceNumber: {
    type: String,
    required: [true, "Invoice Number is obligatory"],
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User is obligatory"],
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, "Product is obligatory"],
  }],
  amount: {
    type: Number,
    required: [true, "Amount is obligatory"],
  },
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
