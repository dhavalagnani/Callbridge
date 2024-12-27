import { connect } from "mongoose";
import { config } from "dotenv";

config();

// MongoDB Connection Function
export const connectToDatabase = () => {
  connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};
