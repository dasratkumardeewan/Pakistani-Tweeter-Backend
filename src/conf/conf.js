import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  console.log("PORT is not defined in .env file");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.log("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

if (!process.env.CORS_ORIGIN) {
  console.log("CORS_ORIGIN is not defined in .env file");
  process.exit(1);
}

if(!process.env.ACCESS_TOKEN_SECRET) {
  console.log("ACCESS_TOKEN_SECRET is not defined in .env file");
  process.exit(1);
}
if(!process.env.ACCESS_TOKEN_EXPIRES_IN) {
  console.log("ACCESS_TOKEN_EXPIRES_IN is not defined in .env file");
  process.exit(1);
}
if(!process.env.REFRESH_TOKEN_SECRET) {
  console.log("REFRESH_TOKEN_SECRET is not defined in .env file");
  process.exit(1);
}
if(!process.env.REFRESH_TOKEN_EXPIRES_IN) {
  console.log("REFRESH_TOKEN_EXPIRES_IN is not defined in .env file");
  process.exit(1);
}

const config = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
};

export default config;
