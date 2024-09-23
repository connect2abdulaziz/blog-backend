"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET_KEY = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.SWAGGER_URL = exports.FRONTEND_URL = exports.EMAIL_PASS = exports.EMAIL_FROM = exports.EMAIL_PASSWORD_FORGOT_PASSWORD = exports.EMAIL_FORGOT_PASSWORD = exports.ADMIN_PASSWORD = exports.ADMIN_EMAIL = exports.JWT_REFRESH_EXPIRES_IN = exports.JWT_REFRESH_SECRET_KEY = exports.JWT_EXPIRES_IN = exports.JWT_SECRET_KEY = exports.SEEDER_STORAGE = exports.DIALECT = exports.DB_PORT = exports.DB_HOST = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USERNAME = exports.LOG_LEVEL = exports.POSTGRES_URL = exports.APP_PORT = exports.NODE_ENV = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.NODE_ENV = process.env.NODE_ENV;
exports.APP_PORT = process.env.APP_PORT;
exports.POSTGRES_URL = process.env.POSTGRES_URL;
exports.LOG_LEVEL = process.env.LOG_LEVEL;
exports.DB_USERNAME = process.env.DB_USERNAME;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_NAME = process.env.DB_NAME;
exports.DB_HOST = process.env.DB_HOST;
exports.DB_PORT = process.env.DB_PORT;
exports.DIALECT = process.env.DIALECT;
exports.SEEDER_STORAGE = process.env.SEEDER_STORAGE;
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
exports.JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
exports.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;
exports.ADMIN_EMAIL = process.env.ADMIN_EMAIL;
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
exports.EMAIL_FORGOT_PASSWORD = process.env.EMAIL_FORGOT_PASSWORD;
exports.EMAIL_PASSWORD_FORGOT_PASSWORD = process.env.EMAIL_PASSWORD_FORGOT_PASSWORD;
exports.EMAIL_FROM = process.env.EMAIL_FROM;
exports.EMAIL_PASS = process.env.EMAIL_PASS;
exports.FRONTEND_URL = process.env.FRONTEND_URL;
exports.SWAGGER_URL = process.env.SWAGGER_URL;
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET_KEY = process.env.CLOUDINARY_API_SECRET_KEY;
//# sourceMappingURL=settings.js.map