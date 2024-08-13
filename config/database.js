const {Sequelize} = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');
const sequelize = new Sequelize(config[env]);
module.exports = sequelize


// const {Pool} = require ('pg')
// const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
// });

// pool.connect((err) => {
//   if (err) {
//     console.error('Error connecting to PostgreSQL database:', err.stack)
//   } else {
//     console.log('Connected to PostgreSQL database.')
//   }
// });

// module.exports = pool;