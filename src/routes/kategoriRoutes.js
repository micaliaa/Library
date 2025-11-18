const kategoriController = require('../controllers/kategoriController');
const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');


router.get('/',authMiddleware(['Administrator', 'Petugas', 'Peminjam']),kategoriController.getAllKategori);
router.get('/:id',authMiddleware(['Administrator', 'Petugas', 'Peminjam']),kategoriController.getKategoriById);


router.post('/', authMiddleware(['Administrator','Petugas']),kategoriController.createKategori);
router.put('/:id', authMiddleware(['Administrator','Petugas']),kategoriController.updateKategori);
router.delete('/:id', authMiddleware(['Administrator','Petugas']),kategoriController.deleteKategori);

module.exports= router;