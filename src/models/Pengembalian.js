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
    PeminjamanID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Peminjaman,
            key:"PeminjamanID",
        },

    },
    BukuID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Buku,
            key:BukuID,
        },
    },
    TanggalPengembalian:{
        type:DataTypes.DATE,
        allowNull:false,
    },
    StatusPengembalian:{
        type:DataTypes.STRING,
    },

},{
    tableName:'pengembalian',
    timestamps:true,
})

Pengembalian.belongsTo(Peminjaman,{forgeinKey:"PeminjamanID",onDelete:"CASCADE"});
Peminjaman.hasMany(Pengembalian,{forgeinKey:"PeminjamanID",onDelete:"CASCADE"});

Pengembalian.belongsTo(User,{forgeinKey:"UserID",onDelete:"CASCADE"});
User.hasMany(Pengembalian,{forgeinKey:"UserID", onDelete:"CASCADE"});

Pengembalian.belongsTo(Buku,{forgeinKey:"BukuID",onDelete:"CASCADE"});
Buku.hasMany(Pengembalian,{forgeinKey:"Buku", onDelete:"CASCADE"});

module.exports = Pengembalian;