import * as dotenv from 'dotenv';

dotenv.config({ path: `${process.cwd()}/.env` });

export const BASE_URL = process.env.BASE_URL || process.env.FRONTEND_URL;
export const PORT = process.env.APP_PORT;
export const USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.DB_PASSWORD;
export const HOST = process.env.DB_HOST;
export const DATABASE = process.env.DB_NAME;
export const DIALECT = process.env.DIALECT;
export const EMAIL = process.env.ADMIN_EMAIL;
export const EMAIL_PASSWORD = process.env.ADMIN_PASSWORD;
export const SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_EXPIRATION = process.env.JWT_EXPIRES_IN;
export const PASSWORD_RESET_EXPIRATION = process.env.PASSWORD_RESET_EXPIRATION || "1h";
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || "7d";
export const DB_URL = process.env.POSTGRES_URL;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const EMAIL_FORGOT_PASSWORD = process.env.EMAIL_FORGOT_PASSWORD;
export const EMAIL_PASSWORD_FORGOT_PASSWORD = process.env.EMAIL_PASSWORD_FORGOT_PASSWORD;

export const dbConfig = {
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DIALECT: process.env.DIALECT,
  SEEDER_STORAGE: process.env.SEEDER_STORAGE,
  POSTGRES_URL: process.env.POSTGRES_URL,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
