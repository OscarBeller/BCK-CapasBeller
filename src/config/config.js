import dotenv from "dotenv";
import __dirname from "../utils.js";
dotenv.config({ path: `${__dirname}/.env`, override: true });

export const config = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME,
  SECRET: process.env.SECRET,
  CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
  CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
};
