const kategoriRepository = require('../repositories/kategoriBukuRepository');

class KategoriController {
    async getAllKategori(req, res) {
        try {
            const kategori = await kategoriRepository.findAll();
            res.json(kategori);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getKategoriById(req, res) {
        try {
            const kategori = await kategoriRepository.findById(req.params.id);
            if (!kategori) return res.status(404).json({ message: 'Kategori not found' });
            res.json(kategori);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createKategori(req, res) {
        try {
            const { KategoriID, NamaKategori } = req.body;
        
            if (!NamaKategori) {
              return res.status(400).json({ message: 'Kategori are required.' });
            }
        
            const newKategori = await kategoriRepository .create({
                KategoriID,
                NamaKategori,
            });
            res.status(201).json({
              message: 'Kategori created successfully',
              kategori: newKategori,
              });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }

    async updateKategori(req, res) {
        try {
            const updatedKategori = await kategoriRepository.update(req.params.id, req.body);
            if (!updatedKategori) return res.status(404).json({ message: 'Kategori not found' });
            res.json(updatedKategori);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteKategori(req, res) {
        try {
            const deleteKategori = await kategoriRepository.delete(req.params.id);
            if (!deleteKategori) return res.status(404).json({ message: 'Kategori not found' });
            res.json({ message: 'Kategori deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new KategoriController();
