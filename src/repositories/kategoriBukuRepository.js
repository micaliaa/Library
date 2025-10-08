const Kategori = require('../models/KategoriBuku')

class KategoriBukuRepository{
    async findAll(){
        return await Kategori.findAll();
    }
    async findById(){
        return await Kategori.findByPk(id);
    }
    async create(kategoriData){
        return await Kategori.create(kategoriData);
    }
    async update(id,kategoriData){
        const kategori = await Kategori.findByPk(id);
        if (!kategori) return null;
        return await kategori.update(kategoriData);
    }
    async delete(id){
        const kategori = await Kategori.findByPk(id);
        if (!kategori) return null;
         await kategori.destroy();
         return kategori;
        
    }
}
module.exports = new KategoriBukuRepository();