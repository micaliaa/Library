const koleksiRepository =require("../repositories/koleksiRepository")

class KoleksiController {
    async getAllKoleksi(req, res) {
        try {
            const koleksi = await koleksiRepository.findAll();
            res.json(koleksi);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getKoleksiById(req, res) {
        try {
            const koleksi = await koleksiRepository.findById(req.params.id);
            if (!koleksi) return res.status(404).json({ message: 'Koleksi not found' });
            res.json(koleksi);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getKoleksiByUser(req, res) {
        try {
            const { userId } = req.params;
            const koleksi = await koleksiRepository.findByUserId(userId);
            res.json(koleksi);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createKoleksi(req, res) {
        try {
            const { BukuID, UserID } = req.body;

            if (!BukuID || !UserID) {
                return res.status(400).json({ message: 'BukuID and UserID are required.' });
            }

            const newKoleksi = await koleksiRepository.create({
               
                BukuID,
                UserID,
            });

            res.status(201).json(newKoleksi);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateKoleksi(req, res) {
        try {
            const updatedKoleksi = await koleksiRepository.update(req.params.id, req.body);
            if (!updatedKoleksi) return res.status(404).json({ message: 'Koleksi not found' });
            res.json(updatedKoleksi);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteKoleksi(req, res) {
        try {
            const deleteKoleksi = await koleksiRepository.delete(req.params.id);
            if (!deleteKoleksi) return res.status(404).json({ message: 'Koleksi not found' });
            res.json({ message: 'Koleksi deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteByUserAndBook(req, res) {
        try {
            const { UserID, BukuID } = req.body;

            if (!UserID || !BukuID) {
                return res.status(400).json({ message: "UserID dan BukuID harus disertakan." });
            }

            const deletedKoleksi = await koleksiRepository.deleteByUserAndBook(UserID, BukuID);

            if (!deletedKoleksi) {
                return res.status(404).json({ message: "Koleksi tidak ditemukan." });
            }

            res.json({ message: "Koleksi berhasil dihapus." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new KoleksiController();
