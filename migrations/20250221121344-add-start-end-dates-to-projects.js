'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'startDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.addColumn('Projects', 'endDate', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Projects', 'startDate');
    await queryInterface.removeColumn('Projects', 'endDate');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
