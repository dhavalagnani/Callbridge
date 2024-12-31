// models/Call.js
import mongoose from "mongoose";

const CallSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  callee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  callType: {
    type: String,
    enum: ["audio", "video"],
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
  }, // in seconds
});

export default mongoose.model("Call", CallSchema);
