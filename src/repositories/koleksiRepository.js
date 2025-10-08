const KoleksiPribadi = require('../models/KoleksiPribadi');
const User = require('../models/User');
const Buku=require('../models/Buku');

class KoleksiRepository{
    async findAll(){
        return await KoleksiPribadi.findAll({
            include:[User,Buku]
        })
    }
    async findById(id){
        return await KoleksiPribadi.findByPk(id,{
            include:[User,Buku]
        })
    }
    async create(koleksiData){
        return await KoleksiPribadi.create(koleksiData);
    }
    async update(id,koleksiData){
        const koleksi=  await KoleksiPribadi.findByPk(id);
        if(!koleksi)return null;
        return await koleksi.update(koleksiData)
    }
    async delete(id){
        const koleksi=await KoleksiPribadi.findByPk(id);
        if(!koleksi)return null;
       await koleksi.destroy()
       return await koleksi;
    }
}
module.exports =new KoleksiRepository();
