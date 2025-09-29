const {DataTypes}  = require('sequelize');
const sequelize = require('../config/databaseConfig');

const KategoriBuku = sequelize.define('kategoribuku', {
    KategoriID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    NamaKategori: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'kategoribuku', // Wajib biar tidak otomatis jadi 'bukus'
    timestamps: true,
});

module.exports = KategoriBuku;