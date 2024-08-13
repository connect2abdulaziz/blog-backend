const {Sequelize} = require('sequelize');
const config = require('./config');
const pg = require('pg');


console.log(config)
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
