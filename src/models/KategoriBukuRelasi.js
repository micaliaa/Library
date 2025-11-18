const { DataTypes } = require("sequelize");
const sequelize = require("../config/databaseConfig"); // Pastikan ini benar
const Buku = require("./Buku");
const KategoriBuku = require("./KategoriBuku");

const KategoriBukuRelasi = sequelize.define(
  "kategoribuku_relasi",
  {
    KategoriBukuRelasiID: {
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

KategoriBukuRelasi.belongsTo(Buku, { foreignKey: "BukuID",onDelete: "CASCADE" });
Buku.hasMany(KategoriBukuRelasi, { foreignKey: "BukuID",onDelete: "CASCADE" });

KategoriBukuRelasi.belongsTo(KategoriBuku, { foreignKey: "KategoriID",onDelete: "CASCADE" });
KategoriBuku.hasMany(KategoriBukuRelasi, { foreignKey: "KategoriID",onDelete: "CASCADE" });

module.exports = KategoriBukuRelasi;
