'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //jika sudah diasosiasikan di user, harus dibuat dlu
      Blog.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }
  Blog.init(
    {
      authorId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      content: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Blog',
    }
  );
  return Blog;
};
