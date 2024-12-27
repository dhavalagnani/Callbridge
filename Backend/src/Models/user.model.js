// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mpin: {
      type: String,
    }, // For M-PIN
    biometric: {
      id: String,
      publicKey: String,
    },
    // callHistory: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Call",
    //   },
    // ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
