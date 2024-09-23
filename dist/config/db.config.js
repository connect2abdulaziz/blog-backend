"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const app_config_1 = require("./app.config");
exports.config = {
    development: {
        username: app_config_1.APP_CONFIG.DB_USERNAME,
        password: app_config_1.APP_CONFIG.DB_PASSWORD,
        database: app_config_1.APP_CONFIG.DB_NAME,
        host: app_config_1.APP_CONFIG.DB_HOST,
        dialect: app_config_1.APP_CONFIG.DIALECT,
    },
    test: {
        username: app_config_1.APP_CONFIG.DB_USERNAME,
        password: app_config_1.APP_CONFIG.DB_PASSWORD,
        database: app_config_1.APP_CONFIG.DB_NAME,
        host: app_config_1.APP_CONFIG.DB_HOST,
        dialect: app_config_1.APP_CONFIG.DIALECT,
    },
    production: {
        production_db_url: app_config_1.APP_CONFIG.POSTGRES_URL,
        dialect: app_config_1.APP_CONFIG.DIALECT,
    },
};
