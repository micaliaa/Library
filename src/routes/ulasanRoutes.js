const express = require('express');
const ulasanController =require('../controllers/ulasanController');
const router = express.Router();
const authMiddleware=require('../middleware/authMiddleware');

router.post('/',authMiddleware(['Peminjam']),ulasanController.createUlasan);
router.get('/',authMiddleware(['Administrator','Peminjam','Petugas']), ulasanController.getAllUlasan);
router.get('/:id',authMiddleware(['Administrator','Peminjam','Petugas']),ulasanController.getUlasanById);
router.put('/:id',authMiddleware(['Peminjam', 'Administrator']),ulasanController.updateUlasan);
router.delete('/:id',authMiddleware(['Peminjam', 'Administrator']), ulasanController.deleteUlasan);

module.exports=router;