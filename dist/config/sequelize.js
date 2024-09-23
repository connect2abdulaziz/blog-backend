"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./app.config");
const sequelize_1 = require("sequelize");
const db_config_1 = require("./db.config");
const pg_1 = __importDefault(require("pg"));
var Environment;
(function (Environment) {
    Environment["Development"] = "development";
    Environment["Test"] = "test";
    Environment["Production"] = "production";
})(Environment || (Environment = {}));
const env = app_config_1.APP_CONFIG.NODE_ENV || Environment.Development;
const dbConfig = db_config_1.config;
const config = dbConfig[env];
// Initialize Sequelize
let sequelize;
if (env === Environment.Production) {
    const ProductionConfig = config;
    sequelize = new sequelize_1.Sequelize(ProductionConfig.production_db_url, {
        dialect: ProductionConfig.dialect,
        dialectModule: pg_1.default,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    });
}
else {
    const devTestConfig = config;
    sequelize = new sequelize_1.Sequelize(devTestConfig.database, devTestConfig.username, devTestConfig.password, {
        host: devTestConfig.host,
        dialect: devTestConfig.dialect,
    });
}
exports.default = sequelize;
