'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pengembalian', {
      PengembalianID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PeminjamanID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'peminjaman', // nama tabel
          key: 'PeminjamanID',
        },
        onDelete: 'CASCADE',
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'UserID',
        },
        onDelete: 'CASCADE',
      },
      BukuID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'buku',
          key: 'BukuID',
        },
        onDelete: 'CASCADE',
      },
      TanggalPengembalian: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      StatusPengembalian: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pengembalian');
  },
};
