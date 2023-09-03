import dotenv from "dotenv";

dotenv.config();

const APP_CONFIG = {
  MONGO_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  PORT: parseInt(process.env.PORT),
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

export { APP_CONFIG };
