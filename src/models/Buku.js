module.exports = (sequelize, DataTypes) => {


const Buku = sequelize.define('buku', { // Nama model bisa 'Buku', tapi tabel harus benar
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
        allowNull: true, // Gambar  opsional
    }
}, {
    tableName: 'buku',
    timestamps: true,
});
return Buku;
};
// module.exports = Buku;
