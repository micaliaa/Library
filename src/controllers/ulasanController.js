const ulasanRepository = require('../repositories/ulasanRepository');
const UlasanRepository=require('../repositories/ulasanRepository');

class UlasanController{
    async getAllUlasan(req, res) {
        try {
            const ulasan = await ulasanRepository.findAll();
            res.json(ulasan);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async getUlasanById(req, res) {
        try {
            const ulasan = await ulasanRepository .findById(req.params.id);
            if (!ulasan) return res.status(404).json({message: 'Ulasan not found'});
            res.json(ulasan);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async createUlasan(req, res) {
        try {
          
          const { BukuID, UserID, Ulasan, Rating } = req.body;
      
          if (!Ulasan || !Rating) {
            return res.status(400).json({ message: 'Ulasan and Rating are required.' });
          }
      
          const newUlasan = await ulasanRepository .create({
            UserID,
            BukuID,
            Ulasan,
            Rating,
          });
          res.status(201).json({
            message: 'Ulasan created successfully',
            user: newUlasan,
            });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }

    async updateUlasan(req,rqs){
        try{
            const updatedUlasan=await ulasanRepository.update(req.params.id,req.body)
            if(!updatedUlasan)return res.status(404).json({message:'ulasan not found'})
                res.json(updatedUlasan)
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
    async deleteUlasan(req,rqs){
        try{
            const deletedUlasan=await ulasanRepository.update(req.params.id)
            if(!deletedUlasan)return res.status(404).json({message:'ulasan not found'})
                res.json({message:'ulasan deleted succesfully'})
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
    
}
module.exports=new UlasanController();