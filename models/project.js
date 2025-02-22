'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Example of association
      // Project.belongsTo(models.User, { foreignKey: 'authorId' });
      Project.belongsTo(models.User, {
        foreignKey: 'authorId',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  Project.init(
    {
      authorId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      content: DataTypes.TEXT,
      skills: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Project',
      // tableName: 'Projects', // Make sure it matches your table name
      // timestamps: true, // Keeps createdAt and updatedAt in sync
    }
  );

  return Project;
};
