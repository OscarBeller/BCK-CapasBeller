import mongoose from "mongoose";
const usersCollection = "users";
const usersSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    age: Number,
    password: String,
    cart: { type: mongoose.Types.ObjectId, ref: "carts" },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const usersModel = mongoose.model(usersCollection, usersSchema);
