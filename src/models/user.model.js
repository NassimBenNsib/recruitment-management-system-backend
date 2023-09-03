import mongoose from "mongoose";
import { UserRole, UserStatus } from "./../constants/index.js";
import { CounterModel } from "./counter.model.js";

const UserSchema = new mongoose.Schema(
  {
    userNumber: { required: true, type: Number, unique: true },
    lastName: { required: true, type: String, trim: true },
    firstName: { required: true, type: String, trim: true },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
    },
    password: { required: true, type: String, trim: true },
    department: { required: false, type: String, trim: true },
    status: {
      type: String,
      enum: [...Object.values(UserStatus)],
      require: true,
      trim: true,
    },
    role: {
      type: String,
      enum: [...Object.values(UserRole)],
      require: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);
