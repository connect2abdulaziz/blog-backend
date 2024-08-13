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
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    seederStorage: 'sequelize',
    dbUri: process.env.POSTGRES_URL
  },
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
};
