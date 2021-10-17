const Sequelize = require('sequelize');

const sequelize = new Sequelize('meffy','root','1234',{
   dialect: 'mysql',
   host: 'localhost', 
   //logging: false
});

module.exports = sequelize;