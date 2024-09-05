const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  postId: DataTypes.INTEGER,
  content: DataTypes.STRING,
});

module.exports = Comment;
