const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig"); // Pastikan ini benar
const Buku = require("./Buku");
const KategoriBuku = require("./KategoriBuku");

const KategoriBukuRelasi = sequelize.define(
  "kategoribuku_relasi",
  {
    KategoriBukuID: {
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
    KategoriID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: KategoriBuku,
        key: "KategoriID",
      },
    },
  },
  {
    tableName: "kategoribuku_relasi",
    timestamps: true,
  }
);

KategoriBukuRelasi.belongsTo(Buku, { foreignKey: "BukuID" });
Buku.hasMany(KategoriBukuRelasi, { foreignKey: "BukuID" });

KategoriBukuRelasi.belongsTo(KategoriBuku, { foreignKey: "KategoriID" });
KategoriBuku.hasMany(KategoriBukuRelasi, { foreignKey: "KategoriID" });

module.exports = KategoriBukuRelasi;
