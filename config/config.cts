import { config as dotenvConfig } from 'dotenv';
import { Config } from '../utils/interfaces';

// Load environment variables from .env file
dotenvConfig({ path: `${process.cwd()}/.env` });

const config: Config = {
  development: {
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
  },
  test: {
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
  },
  production: {
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
  }
};

export default config;
