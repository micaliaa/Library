const Peminjaman = require('../models/Peminjaman');
const Buku = require('../models/Buku');
const User = require('../models/User');
const peminjamanRepository = require('../repositories/peminjamanRepository');

class PeminjamanController {

  // Ambil semua peminjaman
  getAllPeminjaman = async (req, res) => {
    try {
      const peminjaman = await Peminjaman.findAll({
        include: [
          { model: Buku },
          { model: User }
        ],
        order: [['TanggalPeminjaman', 'DESC']]
      });

      const result = peminjaman.map(item => ({
        PeminjamanID: item.PeminjamanID,
        User: item.User,
        buku: item.buku,
        TanggalPeminjaman: item.TanggalPeminjaman,
        TanggalPengembalian: item.TanggalPengembalian || null
      }));

      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  getPeminjamanByID = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "ID peminjaman tidak valid" });

      const peminjaman = await peminjamanRepository.findById(id);
      if (!peminjaman) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });

      res.status(200).json(peminjaman);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  getPeminjamanByUserID = async (req, res) => {
    try {
      const userID = Number(req.params.userId);
      if (!userID) return res.status(400).json({ message: "UserID tidak valid" });

      const peminjaman = await peminjamanRepository.findByUserID(userID);
      res.status(200).json(peminjaman);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  createPeminjaman = async (req, res) => {
  try {
    const { BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman } = req.body;
    const UserID = req.user?.UserID || Number(req.body.UserID);

    if (!UserID || !BukuID || !TanggalPeminjaman) {
      return res.status(400).json({ message: "UserID, BukuID, dan TanggalPeminjaman harus diisi" });
    }

    
    const jumlahAktif = await peminjamanRepository.countActiveByUser(UserID);

    if (jumlahAktif >= 3) {
      return res.status(400).json({
        message: "Limit peminjaman tercapai (maksimal 3 buku). Harap kembalikan buku terlebih dahulu."
      });
    }


   
const peminjamanUser = await peminjamanRepository.findByUserID(UserID);
const hasOverdue = peminjamanUser.some(
  (p) => p.StatusPeminjaman && p.StatusPeminjaman.toLowerCase() === "overdue"
);

if (hasOverdue) {
  return res.status(400).json({
    message: "Anda memiliki buku yang terlambat dikembalikan (Overdue). Harap kembalikan sebelum meminjam buku baru."
  });
}

   
    const peminjamanData = await peminjamanRepository.create({
      UserID, BukuID, TanggalPeminjaman, TanggalPengembalian, StatusPeminjaman
    });

    res.status(201).json(peminjamanData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


  updatePeminjaman = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "ID peminjaman tidak valid" });

      const updated = await peminjamanRepository.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });

      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  deletePeminjaman = async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: "ID peminjaman tidak valid" });

      const deleted = await peminjamanRepository.delete(id);
      if (!deleted) return res.status(404).json({ message: "Peminjaman tidak ditemukan" });

      res.status(200).json({ message: "Peminjaman berhasil dihapus", deleted });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

    // Hitung peminjaman aktif (buku belum dikembalikan)
  countActivePeminjaman = async (req, res) => {
    try {
      const activeCount = await Peminjaman.count({
        where: {
          TanggalPengembalian: null // belum dikembalikan
        }
      });

      res.status(200).json({ activeBorrowings: activeCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }


  countPeminjaman = async (req, res) => {
    try {
      const totalPeminjaman = await peminjamanRepository.countPeminjaman();
      res.status(200).json({ totalPeminjaman });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  countActivePeminjaman = async (req, res) => {
  try {
    const activeCount = await peminjamanRepository.countActivePeminjaman();
    res.status(200).json({ activeBorrowings: activeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
}

module.exports = new PeminjamanController();
