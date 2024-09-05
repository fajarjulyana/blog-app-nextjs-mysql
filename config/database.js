const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('blog_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
