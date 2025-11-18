const express = require('express');
const pengembalianController = require('../controllers/pengembalianController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Membuat pengembalian baru (hanya Peminjam)
router.post('/', authMiddleware(['Peminjam']), pengembalianController.createPengembalian);

// Get pengembalian berdasarkan user (letakkan sebelum :id)
router.get('/user/:userId', authMiddleware(['Peminjam', 'Administrator', 'Petugas']), pengembalianController.getPengembalianByUserId);

// Get semua pengembalian (admin/petugas)
router.get('/', authMiddleware(['Administrator', 'Petugas']), pengembalianController.getAllPengembalian);

// Get pengembalian berdasarkan ID (admin/petugas)
router.get('/:id', authMiddleware(['Administrator', 'Petugas']), pengembalianController.getPengembalianById);

// Hapus pengembalian (admin/petugas/peminjam)
router.delete('/:id', authMiddleware(['Peminjam', 'Administrator', 'Petugas']), pengembalianController.deletePengembalian);

module.exports = router;
