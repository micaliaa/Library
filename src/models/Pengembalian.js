const { DataTypes } = require('sequelize');
const sequelize = require('../config/databaseConfig');
const User = require('./User');
const Buku = require('./Buku');
const Peminjaman = require('./Peminjaman');

const Pengembalian = sequelize.define('pengembalian', {
    PengembalianID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PeminjamanID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Peminjaman,
            key: "PeminjamanID",
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
    BukuID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Buku,
            key: "BukuID",
        },
    },
    TanggalPengembalian: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    StatusPengembalian: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'pengembalian',
    timestamps: true,
});

// Relasi dengan Peminjaman
Pengembalian.belongsTo(Peminjaman, { foreignKey: "PeminjamanID", onDelete: "CASCADE" });
Peminjaman.hasMany(Pengembalian, { foreignKey: "PeminjamanID", onDelete: "CASCADE" });

// Relasi dengan User
Pengembalian.belongsTo(User, { foreignKey: "UserID", onDelete: "CASCADE" });
User.hasMany(Pengembalian, { foreignKey: "UserID", onDelete: "CASCADE" });

// Relasi dengan Buku
Pengembalian.belongsTo(Buku, { foreignKey: "BukuID", onDelete: "CASCADE" });
Buku.hasMany(Pengembalian, { foreignKey: "BukuID", onDelete: "CASCADE" });

module.exports = Pengembalian;
