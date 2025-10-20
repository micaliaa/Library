const kategoriRelasiController = require('../controllers/kategoriRelasiController');
const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware');


router.get('/',authMiddleware(['Administrator', 'Petugas', 'Peminjam']),kategoriRelasiController.getAllKategoriRelasi);
router.get('/:id',authMiddleware(['Administrator', 'Petugas', 'Peminjam']),kategoriRelasiController.getKategoriRelasiByID);
router.get('/kategori/:kategoriID',authMiddleware(['Administrator', 'Petugas', 'Peminjam']),kategoriRelasiController.getKategoriRelasiByKategoriID);
router.post('/', authMiddleware(['Administrator']),kategoriRelasiController.createKategoriRelasi);
router.put('/:id', authMiddleware(['Administrator']),kategoriRelasiController.updateKategoriRelasi);
router.delete('/:id', authMiddleware(['Administrator']),kategoriRelasiController.deleteKategoriRelasi);

module.exports = router;