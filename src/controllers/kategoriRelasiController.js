const kategoriRelasiRepository = require('../repositories/kategoriRelasiRepository');

class KategoriRelasiController{
    async getAllKategoriRelasi(req,res){
        try{
            const relasi=await kategoriRelasiRepository.findAll();
            res.status(200).json(relasi);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
    async getKategoriRelasiByID(req,res){
        try{
            const kategoriRelasi=await kategoriRelasiRepository.findById(req.params.id);
            if(!kategoriRelasi)return res.status(404).json({message:'kategori relasi not found'});
            res.json(kategoriRelasi);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

    async getKategoriRelasiByKategoriID(req,res){
       try{
        const kategoriRelasi=await kategoriRelasiRepository.findByKategoriID(req.params.kategoriID);
        if(!kategoriRelasi || !kategoriRelasi.length === 0){
            return res.status(404).json({message:'kategori relasi not found'});
       }
       res.json(kategoriRelasi);
    }catch(err){
        res.status(500).json({message:err.message});
    }

    }

    async createKategoriRelasi(req,res){
        try{
                const {BukuID,KategoriID}=req.body;
                if(!BukuID||!KategoriID){
                    return res.status(400).json({message:'BukuID and KategoriID are required'})
                }
                const newKategoriRelasi=await kategoriRelasiRepository.create({
                    
                    BukuID,
                    KategoriID,
                });

                res.status(201).json({
                    message:'kategori relasi created succesfully',
                    relasi:newKategoriRelasi
                });
        }catch(err){
            res.status(500).json({message:err.message});

        }
    }
    async updateKategoriRelasi(req,res){
        try{
            const updatedKategoriRelasi=await kategoriRelasiRepository.update(req.params.id,req.body);
            if(!updatedKategoriRelasi)return res.status(404).json({message:'ktegori relasi not found'});
            res.json(updatedKategoriRelasi);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
    async deleteKategoriRelasi(req,res){
        try{
            const deletedKategoriRelasi=await kategoriRelasiRepository.delete(req.params.id);
            if(!deletedKategoriRelasi)return res.status(404).json({message:'kategori relasi not found'});
            res.json({message:'kategori relasi deleted succesfully '});
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
}
module.exports= new KategoriRelasiController();