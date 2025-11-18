const express=require('express')
const upload = require('../middleware/multer');
const bukuController = require('../controllers/bukuController');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');
//route pencarian buku
router.get('/book/search/:keyword',bukuController.searchBooks);

//rekomendasi buku(limit 5)
router.get('/book/getRekomendBooks',bukuController.getRekomendBooks);

//crud buku
router.post('/',authMiddleware(['Administrator']),upload.single('Gambar'),bukuController.createBook);
router.get('/',authMiddleware(['Administrator','Petugas','Peminjam']),bukuController.getAllBooks,);
router.get('/allbuku',authMiddleware(['Administrator','Petugas']),bukuController.getCountBuku);
router.get('/:BukuID',authMiddleware(['Administrator','Petugas','Peminjam']),bukuController.getBookById);
router.put('/:BukuID',authMiddleware(['Administrator','Petugas']),upload.single('Gambar'),bukuController.updateBook);
router.delete('/:BukuID',authMiddleware(['Administrator','Petugas']),bukuController.deleteBook);

module.exports=router;