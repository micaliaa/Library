const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');
const User = require('./User');
const Buku = require('./Buku');

const UlasanBuku = sequelize.define('ulasanbuku', {
  UlasanID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  BukuID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Buku,
      key: "BukuID",
    },
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "UserID",
    },
  },
  Ulasan: {
    type: DataTypes.TEXT,
  },
  Rating: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: "ulasanbuku",
  timestamps: true,
});

UlasanBuku.belongsTo(User, { foreignKey: "UserID", as: "User", onDelete: "CASCADE" });
User.hasMany(UlasanBuku, { foreignKey: "UserID", as: "Ulasan", onDelete: "CASCADE" });

UlasanBuku.belongsTo(Buku, { foreignKey: "BukuID", as: "Buku" });
Buku.hasMany(UlasanBuku, { foreignKey: "BukuID", as: "Ulasan" });

module.exports = UlasanBuku;
