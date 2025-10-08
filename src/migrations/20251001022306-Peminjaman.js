'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('peminjaman',{
     PeminjamanID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "UserID",
        },
    },
    BukuID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: "buku",
            key: "BukuID",
        },
    },
    TanggalPeminjaman: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    TanggalPengembalian: {
        type: Sequelize.DATE,
    },
    StatusPeminjaman: {
        type: Sequelize.STRING,
    },
    createdAt:{
      type:Sequelize.DATE,
      allowNull:false,
    },
    updatedAt:{
      type:Sequelize.DATE,
      allowNull:false,
    },
   })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('peminjaman')
  }
};
