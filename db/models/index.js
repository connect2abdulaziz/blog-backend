'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { dbConfig as config } from '../../config.js';
import pg from 'pg';

const basename = path.basename(import.meta.url);



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

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
