'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('buku', {
      BukuID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Judul: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Penulis: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      Penerbit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      TahunTerbit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      Gambar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('buku');
  }
};
