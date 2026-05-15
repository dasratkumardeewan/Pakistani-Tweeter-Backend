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

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.log("ACCESS_TOKEN_SECRET is not defined in .env file");
  process.exit(1);
}
if (!process.env.ACCESS_TOKEN_EXPIRES_IN) {
  console.log("ACCESS_TOKEN_EXPIRES_IN is not defined in .env file");
  process.exit(1);
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  console.log("REFRESH_TOKEN_SECRET is not defined in .env file");
  process.exit(1);
}
if (!process.env.REFRESH_TOKEN_EXPIRES_IN) {
  console.log("REFRESH_TOKEN_EXPIRES_IN is not defined in .env file");
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
  console.log("GOOGLE_CLIENT_ID is not defined in .env file");
  process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.log("GOOGLE_CLIENT_SECRET is not defined in .env file");
  process.exit(1);
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
  console.log("GOOGLE_REFRESH_TOKEN is not defined in .env file");
  process.exit(1);
}

if (!process.env.GOOGLE_USER) {
  console.log("GOOGLE_USER is not defined in .env file");
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
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER,
};

export default config;
