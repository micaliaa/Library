const express = require('express');
const peminjamanController =require('../controllers/peminjamanController');
const authMiddleware=require('../middleware/authMiddleware')
const router = express.Router();

router.post('/', authMiddleware(['Peminjam']), peminjamanController.createPeminjaman);
router.get('/',authMiddleware(['Administrator', 'Petugas']), peminjamanController.getAllPeminjaman);
router.get('/transaksi',authMiddleware(['Administrator','Petugas']),peminjamanController.countPeminjaman);
router.get('/:id',authMiddleware(['Administrator', 'Petugas']), peminjamanController.getPeminjamanByID);
router.get('/user/:userId',authMiddleware(['Administrator', 'Petugas', 'Peminjam']), peminjamanController.getPeminjamanByUserID);



module.exports=router;