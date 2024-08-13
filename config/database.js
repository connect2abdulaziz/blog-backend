const {Sequelize} = require('sequelize');
const {dbConfig:config} = require('./index');
const pg = require('pg');

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

module.exports = sequelize;
