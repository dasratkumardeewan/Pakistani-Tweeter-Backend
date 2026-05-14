import connectDB from "./db/index.js";
import { app } from "./app.js";
import config from "./conf/conf.js";

connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
