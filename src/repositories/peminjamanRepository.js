const Peminjaman = require('../models/Peminjaman');
const User = require('../models/User');
const Buku = require('../models/Buku');

class PeminjamanRepository {
    async findAll() {
        return await Peminjaman.findAll({
            include: [User, Buku]
        });
    }

    async findById(id) {
        return await Peminjaman.findByPk(id, {
            include: [User, Buku]
        });
    }

    async findByUserID(UserID) {
        return await Peminjaman.findAll({
            where: { UserID },
            include: [Buku]
        });
    }

    async create(peminjamanData) {
        const { UserID, BukuID } = peminjamanData;

        if (!UserID || !BukuID) {
            throw new Error('UserID dan BukuID harus diisi');
        }

        const tanggalPeminjaman = new Date();
        const tanggalPengembalian = new Date();
        tanggalPengembalian.setDate(tanggalPeminjaman.getDate() + 7);

        return await Peminjaman.create({
            UserID,
            BukuID,
            TanggalPeminjaman: tanggalPeminjaman,
            TanggalPengembalian: tanggalPengembalian,
            StatusPeminjaman: "Dipinjam",
        });
    }

    async update(id, peminjamanData) {
        const peminjaman = await Peminjaman.findByPk(id);
        if (!peminjaman) return null;
        return await peminjaman.update(peminjamanData);
    }

    async delete(id) {
        const peminjaman = await Peminjaman.findByPk(id);
        if (!peminjaman) return null;
        await peminjaman.destroy();
        return peminjaman;
    }
}

module.exports = new PeminjamanRepository();
