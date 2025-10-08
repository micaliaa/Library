'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('kategoribuku_relasi',{
     KategoriBukuRelasiID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },  
      BukuID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'buku',    // Nama tabel target
          key: 'BukuID',    // Kolom target
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // atau RESTRICT sesuai kebutuhan
      },
      KategoriID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'kategoribuku', // Nama tabel target
          key: 'KategoriID',     // Kolom target
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('kategoribuku_relasi')
   
  }
};
