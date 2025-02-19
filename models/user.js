'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //jika ada foreign key harus diasosiasikan
      // define association here
      //list atau daftar foreign key yang sudah dibuat
      User.hasMany(models.Blog, {
        foreignKey: 'authorId',
        as: 'blogs',
      });
    }
  }
  //GA ADA ID KARENA ID OTOMATIS DIBUATIN SAMA SEQUELIZE, BAIK BGT XIXIXI
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
