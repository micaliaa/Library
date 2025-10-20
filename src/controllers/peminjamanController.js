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
            const {BukuID}=req.body
            const peminjamanData =await peminjamanRepository.create({
                 UserID: req.user.UserID, 
                 BukuID
        });
       
          
            res.status(201).json(peminjamanData);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
 async countPeminjaman(req,res){
     try{
        const totalPeminjaman=await peminjamanRepository.countPeminjaman()
 
        res.status(200).json({
         totalPeminjaman
     });
     }catch(err){
         return res.status(500).json({message:err.message});
     }
  }
  
}

module.exports = new PeminjamanController();
