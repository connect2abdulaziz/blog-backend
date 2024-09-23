import { Sequelize } from 'sequelize';
import { dbConfig as config } from './index.js';
import pg from 'pg';


//this is important for deployment
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: config.DIALECT,
    dialectModule: pg,
    dialectOptions: config.dialectOptions,
  });
} else {
  sequelize = new Sequelize(config.POSTGRES_URL, {
    dialect: config.DIALECT,
    dialectModule: pg,
    dialectOptions: config.dialectOptions,
  });
}

export default sequelize;
