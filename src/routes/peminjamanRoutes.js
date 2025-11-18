const express = require('express');
const peminjamanController = require('../controllers/peminjamanController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Membuat peminjaman baru (hanya Peminjam)
router.post('/', authMiddleware(['Peminjam']), peminjamanController.createPeminjaman);

// Get semua peminjaman (admin/petugas)
router.get('/', authMiddleware(['Administrator', 'Petugas']), peminjamanController.getAllPeminjaman);
router.get('/active-count', authMiddleware(['Administrator', 'Petugas']), peminjamanController.countActivePeminjaman);

// Count total peminjaman (admin/petugas)
router.get('/transaksi', authMiddleware(['Administrator', 'Petugas']), peminjamanController.countPeminjaman);

// Get peminjaman berdasarkan UserID (letakkan sebelum route :id!)
router.get('/user/:userId', authMiddleware(['Administrator', 'Petugas', 'Peminjam']), peminjamanController.getPeminjamanByUserID);

// Get peminjaman berdasarkan ID (admin/petugas)
router.get('/:id', authMiddleware(['Administrator', 'Petugas']), peminjamanController.getPeminjamanByID);

module.exports = router;
