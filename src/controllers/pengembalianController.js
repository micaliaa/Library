const pengembalianRepository = require('../repositories/pengembalianRepository');

class PengembalianController {
  getAllPengembalian = async (req, res) => {
    try {
      const pengembalian = await pengembalianRepository.findAll();
      res.status(200).json(pengembalian);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  getPengembalianById = async (req, res) => {
    try {
      const id = Number(req.params.id);
      const pengembalian = await pengembalianRepository.findById(id);
      res.status(200).json(pengembalian);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  getPengembalianByUserId = async (req, res) => {
    try {
      const userID = Number(req.params.userId);
      const pengembalian = await pengembalianRepository.findByUserID(userID);
      res.status(200).json(pengembalian);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

createPengembalian = async (req, res) => {
  try {
    const { PeminjamanID, UserID, BukuID, TanggalPengembalian } = req.body;

    // pastikan semuanya dikirim
    if (!PeminjamanID || !UserID || !BukuID) {
      return res.status(400).json({
        message: "Data tidak lengkap: PeminjamanID, UserID, dan BukuID wajib diisi",
      });
    }

    const pengembalianData = await pengembalianRepository.createPengembalian({
      PeminjamanID,
      UserID,
      BukuID, // ⬅️ tambahkan ini!
      TanggalPengembalian,
    });

    res.status(201).json(pengembalianData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


  deletePengembalian = async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await pengembalianRepository.delete(id);
      res.status(200).json({ message: "Pengembalian berhasil dihapus", deleted });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new PengembalianController();
