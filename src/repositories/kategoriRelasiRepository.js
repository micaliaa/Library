const KategoriBukuRelasi = require('../models/KategoriBukuRelasi');
const Buku = require('../models/Buku');
const KategoriBuku = require('../models/KategoriBuku');

class KategoriRelasiRepository{
    async findAll(){
        return await KategoriBukuRelasi.findAll({
            include:[Buku,KategoriBuku]
        })

    }
    async findById(id){
        return await KategoriBukuRelasi.findByPk(id,{
            include:[Buku,KategoriBuku]
        })
        }
        async create(kategoriRelasiData){
            return await KategoriBukuRelasi.create(kategoriRelasiData);
            
        }
        async update(id,kategoriRelasiData){
            const kategoriRelasi=await KategoriBukuRelasi.findByPk(id);
            if (!kategoriRelasi)return null;
            return await kategoriRelasi.update(kategoriRelasiData)
        }
        async delete(id){
            const kategoriRelasi = await KategoriBukuRelasi.findByPk(id);
            if(!kategoriRelasi) return null;
            await kategoriRelasi.destroy();
            return kategoriRelasi;
        }

    }
module.exports = new KategoriRelasiRepository();