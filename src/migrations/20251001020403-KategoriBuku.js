'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('kategoribuku',{
     KategoriID: {
            type:Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        NamaKategori: {
            type:Sequelize.STRING,
            allowNull: false,
        },
        createdAt: {
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      }
   })
  },

  async down (queryInterface, Sequelize) {
  await queryInterface.dropTable('kategoribuku');
  }
};
