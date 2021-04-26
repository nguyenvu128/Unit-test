const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'postgres', 'justbeyourself', {
    dialect: 'postgres',
    host: 'localhost',
    logging: false
});

module.exports = sequelize;