require('dotenv').config({path: `${process.cwd()}/.env`});

module.exports = {
  BASE_URL: process.env.BASE_URL || process.env.FRONTEND_URL, 
  PORT: process.env.APP_PORT,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  HOST: process.env.DB_HOST,
  DATABASE: process.env.DB_NAME,
  DIALECT: process.env.DIALECT,
  EMAIL: process.env.ADMIN_EMAIL, 
  EMAIL_PASSWORD: process.env.ADMIN_PASSWORD, 
  SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRATION: process.env.JWT_EXPIRES_IN,
  PASSWORD_RESET_EXPIRATION: process.env.PASSWORD_RESET_EXPIRATION || "1h", 
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || "7d", 
  DB_URL: process.env.POSTGRES_URL,
  FRONTEND_URL: process.env.FRONTEND_URL, 
  EMAIL_FORGOT_PASSWORD: process.env.EMAIL_FORGOT_PASSWORD,
  EMAIL_PASSWORD_FORGOT_PASSWORD: process.env.EMAIL_PASSWORD_FORGOT_PASSWORD,
  dbConfig: {
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
  },
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
};
