import { Sequelize } from 'sequelize';
import { dbConfig as config } from './index'; 
import pg from 'pg';

// Initialize Sequelize with appropriate configuration
let sequelize: Sequelize;

if (config.USE_ENV_VARIABLE) {
  // If using an environment variable for the database URI
  sequelize = new Sequelize(process.env[config.USE_ENV_VARIABLE] as string, {
    dialect: config.DIALECT as 'postgres',  
    dialectModule: pg,
    dialectOptions: config.dialectOptions,
  });
} else {
  // If using direct connection string
  sequelize = new Sequelize(config.POSTGRES_URL!, {
    dialect: config.DIALECT as 'postgres',  
    dialectModule: pg,
    dialectOptions: config.dialectOptions,
  });
}

export default sequelize;
