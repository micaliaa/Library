const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig");

const Buku = sequelize.define('buku', { 
  BukuID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Judul: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Penulis: {
    type: DataTypes.STRING,
  },
  Penerbit: {
    type: DataTypes.STRING,
  },
  TahunTerbit: {
    type: DataTypes.INTEGER,
  },
  Gambar: {
    type: DataTypes.STRING, 
    allowNull: true, 
  }
}, {
  tableName: 'buku',
  timestamps: true,
});

module.exports = Buku;
