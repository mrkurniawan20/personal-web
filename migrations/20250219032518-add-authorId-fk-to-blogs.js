'use strict';

const { query } = require('express');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //untuk ngejalanin
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('Blogs', {
      fields: ['authorId'],
      type: 'foreign key',
      name: 'fk_authorId_users',
      references: {
        //yang mereferensikan fields
        table: 'Users', //table yang direferensikan
        field: 'id', //fields atau column yang direferensikan
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    //untuk ngilangin
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('Blogs', 'fk_authorId_users');
  },
};
