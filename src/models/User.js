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
    allowNull: true, 
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  NamaLengkap: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  Alamat: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
  Role: {
    type: DataTypes.ENUM('Administrator', 'Petugas', 'Peminjam'),
    allowNull: false,
    defaultValue: 'Peminjam',
  },
  
}, {
  tableName: 'users',  
  timestamps: true,   
});



module.exports = User;