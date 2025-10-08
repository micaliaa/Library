const UlasanBuku=require('../models/UlasanBuku');

class UlasanRepository{
    async findAll(){
        return await UlasanBuku.findAll()
    }
    async findById(id){
        return await UlasanBuku.findById(id);;
    }
    async create(ulasanData){
        return await UlasanBuku.create(ulasanData);
    }
    async update(id,ulasanData){
       const ulasan=await UlasanBuku.findByPk(id);
        if(!ulasan)return null;
        return await ulasan.uodate(ulasanData);
    }
    async delete(id){
        const ulasan=await UlasanBuku.findByPk(id);
        if(!ulasan)return null;
        await ulasan.destroy();
        return ulasan;
    }
}
module.exports=new UlasanRepository();