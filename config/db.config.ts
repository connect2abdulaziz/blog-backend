import { changePasswordSchema } from "utils/validations/user.validator";
import { APP_CONFIG } from "./app.config";

export const config = {
  dev: {
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
  prod: {
    host: 'ep-square-hat-a4cn4aj2-pooler.us-east-1.aws.neon.tech',
    port: APP_CONFIG.DB_PORT,
    production_db_url: APP_CONFIG.POSTGRES_URL,
    dialect: APP_CONFIG.DIALECT,
  },
};
