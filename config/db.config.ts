import { APP_CONFIG } from "./app.config";

export const config = {
  development: {
    username: APP_CONFIG.DB_USERNAME,
    password: APP_CONFIG.DB_PASSWORD,
    database: APP_CONFIG.DB_NAME,
    host: APP_CONFIG.DB_HOST,
    dialect: APP_CONFIG.DIALECT,
  },
  test: {
    username: APP_CONFIG.DB_USERNAME,
    password: APP_CONFIG.DB_PASSWORD,
    database: APP_CONFIG.DB_NAME,
    host: APP_CONFIG.DB_HOST,
    dialect: APP_CONFIG.DIALECT,
  },
  production: {
    production_db_url: APP_CONFIG.POSTGRES_URL,
    dialect: APP_CONFIG.DIALECT,
  },
};
