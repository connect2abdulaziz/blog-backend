import { APP_CONFIG } from "./app.config";
import { Sequelize} from "sequelize";
import { Dialect } from "sequelize/types";
import { config as database } from "./db.config";
import pg from "pg";

enum Environment {
  Development = "dev",
  Test = "test",
  Production = "prod",
}

type DevelopmentOrTestConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
};

type ProductionConfig = {
  host: string;
  port: string;
  production_db_url: string;
  dialect: Dialect;
};

type Config = {
  dev: DevelopmentOrTestConfig;
  test: DevelopmentOrTestConfig;
  prod: ProductionConfig;
};

const env = (APP_CONFIG.NODE_ENV as keyof Config) || Environment.Development;
const dbConfig: Config = database as Config;
const config = dbConfig[env];

// Initialize Sequelize
let sequelize: Sequelize;
console.log(env);
if (env === Environment.Production) {
  const ProductionConfig = config as ProductionConfig;
  sequelize = new Sequelize(ProductionConfig.production_db_url!, {
    host: ProductionConfig.host,
    port: Number(ProductionConfig.port),
    dialect: ProductionConfig.dialect as Dialect,
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
