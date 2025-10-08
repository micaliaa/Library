'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ulasanbuku', {
      UlasanID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'UserID',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      BukuID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'buku', 
          key: 'BukuID',
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      Ulasan: {
        type: Sequelize.TEXT,
      },
      Rating: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ulasanbuku');
  }
};
