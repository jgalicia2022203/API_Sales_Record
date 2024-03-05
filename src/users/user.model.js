import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is obligatory"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is obligatory"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is obligatory"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["CLIENT_ROLE", "ADMIN_ROLE"],
    default: "CLIENT_ROLE",
  },
  fullName: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  history: [{
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);
