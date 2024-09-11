import { config as dotenvConfig } from "dotenv";
import { Config } from "./interfaces";

// Load environment variables from .env file
dotenvConfig({ path: `${process.cwd()}/.env` });

const commonConfig = {
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: process.env.DB_PORT,
  DIALECT: process.env.DIALECT!,
  SEEDER_STORAGE: process.env.SEEDER_STORAGE,
  POSTGRES_URL: process.env.POSTGRES_URL,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const config: Config = {
  development: commonConfig,
  test: commonConfig,
  production: commonConfig,
};

export default config;
