const bukuRepository = require('../repositories/bukuRepository');


class BukuController{
    async getAllBooks(req,res){
        try{
            const books=await bukuRepository.findAll();
            res.json(books);
        }catch(err){
            res.status(500).json({message:err.message});

        }
    }
    async getRekomendBooks(req,res){
        try{
            const books=await bukuRepository.findLimitFive();
            res.json(books);
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }
    async getBookById(req,res){
        try{
            const book=await bukuRepository.findById(req.params.BukuID);
            if(!book)return res.status(401).json({message:'Book not found'});
        }catch(err){
            res.status(500).json({message:err.message});
        }
    }

    async createBook(req,res){
        try{
            const {Judul,Penulis,Penerbit,TahunTerbit}=req.body;
            const Gambar =req.file?req.file.path:null;

            const newBuku=await bukuRepository.create({
                Judul,
                Penulis,
                Penerbit,
                TahunTerbit,
                Gambar,
            });
         res.status(201).json(newBuku);
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
  async updateBook(req,res){
    try{
        const BukuID=(req.params.BukuID);
        const {Judul,Penulis,Penerbit,TahunTerbit}=req.body;
        let Gambar =req.file?req.file.path.replace(/\\/g, '/'):undefined;

        //cari buku yg akan diupdate
        const oldBook=await bukuRepository.findById(BukuID);
        if(!oldBook)return res.status(404).json({message:'Buku tidak ditemukan'});

        //jika ada gambar baru haps gambar yg lama

        if(Gambar){
            //cek jika ada gambar lama dan hapus 
            if(oldBook.Gambar&& fs.existsSync(oldBook.Gambar)){
                fs.unlinkSync((oldBook.Gambar));//hapus gambar lama
            }   
        }else{
            Gambar = oldBook.Gambar;
        }
        //update data
        const updateBook=await bukuRepository.update(BukuID,{
            Judul,
            Penulis,
            Penerbit,
            TahunTerbit,
            Gambar,
        });
        if (!updateBook)return res.status(404).json({message:'Gagal memperbarui buku'});

        res.json({
            BukuID,
            Judul,
            Penulis,
            Penerbit,
            TahunTerbit,
            Gambar,
        })
    }catch(err){
    res.status(500).json({message:err.message});
    }
  }

  async deleteBook(req,res){
    try{
        const deleteBook=await bukuRepository.delete(req.params.BukuID);
        if(!deleteBook)return res.status(404).json({message:'Book not found'});
        res.json({message:'Book deleted succesfully'});

    }catch(err){
        res.status(500).json({message:err.message});
    }
  }
  //controller utk search

  async searchBooks(req,res){
    try{
        const keyword=req.params.keyword;
        const results=await bukuRepository.search(keyword);
        res.json(results);

    }catch(err){
        res.status(500).json({message:err.message});
    }   
  }
}
module.exports=new BukuController();