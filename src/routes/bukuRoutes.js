const express=require('express')
const upload = require('../middleware/multer');
const bukuController = require('../controllers/bukuController');
const router=express.Router();

//route pencarian buku
router.get('/book/search/:keyword',bukuController.searchBooks);

//rekomendasi buku(limit 5)
router.get('/book/getRekomendBooks',bukuController.getRekomendBooks);

//crud buku
router.post('/book',upload.single('Gambar'),bukuController.createBook);
router.get('/book',bukuController.getAllBooks);
router.get('book/:BukuID',bukuController.getBookById);
router.put('/book/:BukuID',bukuController.updateBook);
router.delete('/book/:BookID',bukuController.deleteBook);

module.exports=router;