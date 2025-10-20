const {DataTypes} = require('sequelize');
const sequelize = require('../config/databaseConfig');

const User = require('./User');
const Buku = require('./Buku');

const Peminjaman = sequelize.define('peminjaman', {
    PeminjamanID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "UserID",
        },
    },
    BukuID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Buku,
            key: "BukuID",
        },
    },
    TanggalPeminjaman: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    TanggalPengembalian: {
        type: DataTypes.DATE,
    },
    StatusPeminjaman: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'peminjaman', 
    timestamps: true,   
});
Peminjaman.belongsTo(User, { foreignKey: "UserID", onDelete: "CASCADE"});
User.hasMany(Peminjaman, {foreignKey: "UserID", onDelete: "CASCADE"});

Peminjaman.belongsTo(Buku, {foreignKey: "BukuID"});
Buku.hasMany(Peminjaman, {foreignKey: "BukuID"});

module.exports = Peminjaman;