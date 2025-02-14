'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    //SEEDER BERGUNA UNTUK MEMBUAT DATA DUMMY ATAU DEMO, AGAR TABLE TIDAK KOSONGAN
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Rafli Kurniawan',
        email: 'luigiguido45@gmail.com',
        password: 'luigiguido',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dio Brando',
        email: 'diobrando@gmail.com',
        password: 'diobrando',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Joseph Joestar',
        email: 'josephjoestar@gmail.com',
        password: 'jojo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  },
};
