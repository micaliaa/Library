const peminjamanRepository = require('../repositories/peminjamanRepository');

class PeminjamanController {
    async getAllPeminjaman(req, res) {
        try {
            const peminjaman = await peminjamanRepository.findAll();
            res.json(peminjaman);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getPeminjamanByID(req, res) {
        try {
            const peminjaman = await peminjamanRepository.findById(req.params.id);

            if (!peminjaman)
                return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });

            res.json(peminjaman);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getPeminjamanByUserID(req, res) {
        try {
            const userID = req.params.userID;
            const peminjaman = await peminjamanRepository.findByUserID(userID);

            if (!peminjaman || peminjaman.length === 0) {
                return res.status(404).json({ message: 'Data peminjaman tidak ditemukan' });
            }

            res.json(peminjaman);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createPeminjaman(req, res) {
        try {
            const peminjam = await peminjamanRepository.create(req.body);
            res.status(201).json(peminjam);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async updatePeminjaman(req, res) {
        try {
            const updatedPeminjaman = await peminjamanRepository.update(req.params.id, req.body);
            if (!updatedPeminjaman)
                return res.status(404).json({ message: 'Peminjaman tidak ditemukan.' });

            res.json(updatedPeminjaman);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deletePeminjaman(req, res) {
        try {
            const deletedPeminjaman = await peminjamanRepository.delete(req.params.id);
            if (!deletedPeminjaman)
                return res.status(404).json({ message: 'Peminjaman tidak ditemukan.' });

            res.json({ message: 'Peminjaman berhasil dihapus.' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new PeminjamanController();
