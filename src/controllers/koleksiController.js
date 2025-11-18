const KoleksiRepository = require('../repositories/KoleksiRepository');

const KoleksiController = {
  // ✅ Ambil semua koleksi
  async getAllKoleksi(req, res) {
    try {
      const koleksi = await KoleksiRepository.findAll();
      res.json(koleksi);
    } catch (err) {
      console.error('Error di getAllKoleksi:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ✅ Ambil koleksi berdasarkan UserID (endpoint: /koleksi/user/:id)
  async getByUserId(req, res) {
    try {
    const UserID = parseInt(req.params.userId, 10);
// pastikan integer
      console.log(`🔍 Mencari koleksi untuk UserID: ${UserID} (type: ${typeof UserID})`);

      const koleksi = await KoleksiRepository.findByUserId(UserID);

      if (!koleksi || koleksi.length === 0) {
       res.status(200).json(koleksi || []);
      }

      res.json(koleksi);
    } catch (error) {
      console.error('Error di getByUserId:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Tambahkan koleksi baru
  async createKoleksi(req, res) {
    try {
      const newKoleksi = await KoleksiRepository.create(req.body);
      res.status(201).json(newKoleksi);
    } catch (err) {
      console.error('Error di createKoleksi:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ✅ Update koleksi
  async updateKoleksi(req, res) {
    try {
      const updated = await KoleksiRepository.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Koleksi tidak ditemukan' });
      res.json(updated);
    } catch (err) {
      console.error('Error di updateKoleksi:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ✅ Hapus koleksi berdasarkan ID
  async deleteKoleksi(req, res) {
    try {
      const deleted = await KoleksiRepository.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Koleksi tidak ditemukan' });
      res.json({ message: 'Koleksi berhasil dihapus' });
    } catch (err) {
      console.error('Error di deleteKoleksi:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // ✅ Hapus koleksi berdasarkan UserID dan BukuID
  async deleteByUserAndBook(req, res) {
    console.log('body request:',req.body)
    const { UserID, BukuID } = req.body;
    if (!UserID || !BukuID) {
      console.error('UserID atau BukuID kosong di request body');
      return res.status(400).json({ error: 'UserID dan BukuID harus diisi' });
    }

    try {
      const koleksi = await KoleksiRepository.findByUserId(UserID);
      const target = koleksi.find(k => k.BukuID == BukuID);

      if (!target) return res.status(404).json({ error: 'Koleksi tidak ditemukan' });

      await KoleksiRepository.delete(target.KoleksiID);
      res.json({ message: 'Koleksi berhasil dihapus' });
    } catch (err) {
      console.error('Error di deleteByUserAndBook:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = KoleksiController;
