const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware=require('../middleware/authMiddleware');
const router = express.Router();

router.get('/allpetugas',authMiddleware(['Administrator']),userController.getAllPetugas);
router.get('/allpeminjam',authMiddleware(['Administrator','Petugas']),userController.getAllPeminjam);
router.get('/count',authMiddleware(['Administrator','Petugas']),userController.getCountByRole);
router.post('/',authMiddleware(['Administrator']), userController.createUser); 
router.get('/',authMiddleware(['Administrator','Petugas']), userController.getAllUsers); 
router.get('/:id',authMiddleware(['Administrator','Petugas','Peminjam']), userController.getUserById);
router.put('/:id',authMiddleware(['Administrator']) ,userController.updateUser);
router.delete('/:id',authMiddleware(['Administrator']) ,userController.deleteUser);

module.exports = router;