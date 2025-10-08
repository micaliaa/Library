const { DATE } = require('sequelize');
const pengembalianRepository=require('../repositories/pengembalianRepository');


class PengembalianController{
    async getAllPengembalian(req,res){
        try{
            const pengembalian=await pengembalianRepository.findAll();
            res.json(pengembalian);
    }catch(err){
        res.status(500).json({message:err.message});
    } 
}
    async getPengembalianById(req, res) {
        try {
            const pengembalian = await pengembalianRepository.findById(req.params.id);
            if (!pengembalian) return res.status(404).json({ message: 'Pengembalian not found' });
            res.json(pengembalian);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getPengembalianByUserId(req,res){
        try{
            const {userID}=req.params
            const pengembalian=await pengembalianRepository.findByUserID(userID);

            if(!pengembalian || pengembalian.length ===0){
                return res.status(404).json({message:'Tidak ada data pengembalian untuk user ini'})
            }
            res.json(pengembalian);
        }catch(err){
            res.status(500).json({message:err.message})
        }
    }
    async createPengembalian(req,res){
        try{
            const data={
               ...req.body,
             TanggalPengembalian: new Date().toISOString()
            };

            if(!data.PeminjamanID||!data.UserID||!data.BukuID){
                return res.status(400).json({err:'Data Tidak lengkap:PeminjamanID,userID dan PengembalianId wajib diisi'})

            }

const tanggalPengembalian = new Date();

            const pengembalian=await pengembalianRepository.createPengembalian(data);
            res.json(pengembalian)
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
    async updatePengembalian(req,res){
        try{
            const updatedPengembalian=await pengembalianRepository.update(req.params.id,req.body);
            if(!updatedPengembalian)return res.status(404).json({message:'pengembalian not found'});
            res.json(updatedPengembalian);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

    async deletePengembalian(req,res){
        try{
            const deletedPengembalian=await pengembalianRepository.delete(req.params.id);
            if(!deletedPengembalian)return res.status(404).json({message:'Pengembalian not found'});
            res.json({message:'Pengembalian Deleted succesfully'});
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
  
}module.exports=new PengembalianController();