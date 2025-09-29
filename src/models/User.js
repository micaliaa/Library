const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,  // Password harus diisi
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,  // Email harus diisi
  },
  NamaLengkap: {
    type: DataTypes.STRING,
    allowNull: false,  // NamaLengkap harus diisi
  },
  Alamat: {
    type: DataTypes.TEXT,
    allowNull: false,  // Alamat harus diisi
  },
  Role: {
    type: DataTypes.ENUM('Administrator', 'Petugas', 'Peminjam'),
    allowNull: false,
    defaultValue: 'Peminjam',
  },
  AccessToken: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'user',  
  timestamps: true,   
});

module.exports = User;