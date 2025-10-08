const Pengembalian = require('../models/Pengembalian');
const User = require('../models/User');
const Buku = require('../models/Buku');
const Peminjaman = require('../models/Peminjaman');

class PengembalianRepository {
    async findAll() {
        return await Pengembalian.findAll({
            include: [User, Buku, Peminjaman]
        });
    }

    async findById(id) {
        return await Pengembalian.findByPk(id, {
            include: [User, Buku, Peminjaman]
        });
    }

    async findByUserID(UserID) {
        return await Pengembalian.findAll({
            where: { UserID },
            include: [User, Buku, Peminjaman],
            order: [['TanggalPengembalian', 'DESC']],
        });
    }

    async createPengembalian(data) {
        const { PeminjamanID, UserID, BukuID, TanggalPengembalian, StatusPengembalian } = data;

        if (!PeminjamanID || !UserID || !BukuID) {
            throw new Error('Data tidak lengkap: PeminjamanID, UserID, dan BukuID wajib diisi');
        }

        const cekPeminjaman = await Peminjaman.findByPk(PeminjamanID);
        const cekUser = await User.findByPk(UserID);
        const cekBuku = await Buku.findByPk(BukuID);

        if (!cekPeminjaman || !cekUser || !cekBuku) {
            throw new Error('Peminjaman/User/Buku tidak ada');
        }

        return await Pengembalian.create({
            PeminjamanID,
            UserID,
            BukuID,
            TanggalPengembalian: TanggalPengembalian || new Date(),
            StatusPengembalian: StatusPengembalian || 'Dikembalikan',
        });
    }

    async update(id, pengembalianData) {
        const pengembalian = await Pengembalian.findByPk(id);
        if (!pengembalian) return null;
        return await pengembalian.update(pengembalianData);
    }

    async delete(id) {
        const pengembalian = await Pengembalian.findByPk(id);
        if (!pengembalian) return null;
        await pengembalian.destroy();
        return pengembalian;
    }
}

module.exports = new PengembalianRepository();
