const sequelize = require("../config/databaseConfig")
const DataTypes = require("sequelize")

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
    Gambar: { // Kolom untuk gambar
        type: DataTypes.STRING, 
        allowNull: true, 
    }
}, {
    tableName: 'buku',
    timestamps: true,
});



module.exports = Buku;
