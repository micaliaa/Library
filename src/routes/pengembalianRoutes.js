const express = require('express');
const pengembalianController =require('../controllers/pengembalianController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/',authMiddleware(['Peminjam']), pengembalianController.createPengembalian);
router.get('/',authMiddleware(['Administrator', 'Petugas']), pengembalianController.getAllPengembalian);
router.get('/:id', authMiddleware(['Administrator', 'Petugas']), pengembalianController.getPengembalianById);
router.get('/user/:userId', authMiddleware(['Peminjam', 'Administrator', 'Petugas']), pengembalianController.getPengembalianByUserId);

router.delete('/:id', authMiddleware(['Peminjam', 'Administrator', 'Petugas']), pengembalianController.deletePengembalian);

module.exports=router;