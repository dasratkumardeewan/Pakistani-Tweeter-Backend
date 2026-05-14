import mongoose from "mongoose";
import config from "../conf/conf.js";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const response = await mongoose.connect(`${config.MONGODB_URI}/${DB_NAME}`);
    console.log(
      "MongoDB Connected Successfully! HOST :",
      response.connection.host,
    );
  } catch (error) {
    console.log("MongoDB Connection Failed. ERROR : ", error.message);
    process.exit(1);
  }
};

export default connectDB