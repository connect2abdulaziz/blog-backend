import { APP_CONFIG } from "./app.config";
import { Sequelize, Dialect } from "sequelize";
import { config as database } from "./db.config";
import pg from "pg";

enum Environment {
  Development = "development",
  Test = "test",
  Production = "production",
}

type DevelopmentOrTestConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
};

type ProductionConfig = {
  production_db_url: string;
  dialect: Dialect;
};

type Config = {
  development: DevelopmentOrTestConfig;
  test: DevelopmentOrTestConfig;
  production: ProductionConfig;
};

const env = (APP_CONFIG.NODE_ENV as keyof Config) || Environment.Development;
const dbConfig: Config = database as Config;
const config = dbConfig[env];

// Initialize Sequelize
let sequelize: Sequelize;

if (env === Environment.Production) {
  const ProductionConfig = config as ProductionConfig;
  sequelize = new Sequelize(ProductionConfig.production_db_url, {
    dialect: ProductionConfig.dialect,
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const devTestConfig = config as DevelopmentOrTestConfig;
  sequelize = new Sequelize(
    devTestConfig.database,
    devTestConfig.username,
    devTestConfig.password,
    {
      host: devTestConfig.host,
      dialect: devTestConfig.dialect,
    }
  );
}

export default sequelize;
