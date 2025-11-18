const express = require('express');
const router = express.Router();
const koleksiController = require('../controllers/koleksiController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/',
  authMiddleware(['Peminjam']),
  koleksiController.createKoleksi
);

// router.get(
//   '/',
//   authMiddleware(['Administrator', 'Petugas']),
//   koleksiController.getAllKoleksi
// );

router.get(
  '/user/:userId',
  authMiddleware(['Administrator', 'Petugas', 'Peminjam']),
  koleksiController.getByUserId
);

// router.get(
//   '/:id',
//   authMiddleware(['Administrator', 'Petugas', 'Peminjam']),
//   koleksiController.getKoleksiById
// );

router.put(
  '/:id',
  authMiddleware(['Peminjam']),
  koleksiController.updateKoleksi
);
router.delete('/by-user-book', koleksiController.deleteByUserAndBook);

router.delete(
  '/:id',
  authMiddleware(['Administrator', 'Peminjam']),
  koleksiController.deleteKoleksi
);

// untuk delete by UserID + BukuID


module.exports = router;
