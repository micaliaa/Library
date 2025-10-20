const express = require('express');
const koleksiController =require('../controllers/koleksiController')
const router = express.Router();
const authMiddleware=require('../middleware/authMiddleware')


router.post('/',authMiddleware(['Peminjam']), koleksiController.createKoleksi);
router.get('/', authMiddleware(['Administrator', 'Petugas']), koleksiController.getAllKoleksi);
router.get('/:id', authMiddleware(['Administrator', 'Petugas', 'Peminjam']), koleksiController.getKoleksiById);
router.get('/user/:userId',authMiddleware(['Administrator', 'Petugas', 'Peminjam']),  koleksiController.getKoleksiByUser);
router.put('/:id',authMiddleware(['Peminjam']), koleksiController.updateKoleksi);
router.delete('/:id',authMiddleware(['Administrator', 'Peminjam']),   koleksiController.deleteKoleksi);
router.delete('/koleksi', authMiddleware(['Peminjam']), koleksiController.deleteByUserAndBook);

module.exports = router;