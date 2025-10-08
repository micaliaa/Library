const express = require('express');
const peminjamanController =require('../controllers/peminjamanController');

const router = express.Router();

router.post('/', peminjamanController.createPeminjaman);
router.get('/', peminjamanController.getAllPeminjaman);
router.get('/:id', peminjamanController.getPeminjamanByID);
router.get('/user/:userId', peminjamanController.getPeminjamanByUserID);
router.put('/:id', peminjamanController.updatePeminjaman);
router.delete('/:id', peminjamanController.deletePeminjaman);

module.exports=router;