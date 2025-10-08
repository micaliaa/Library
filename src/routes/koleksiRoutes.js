const express = require('express');
const koleksiController =require('../controllers/koleksiController')
const router = express.Router();

router.post('/', koleksiController.createKoleksi);
router.get('/', koleksiController.getAllKoleksi);
router.get('/:id', koleksiController.getKoleksiById);
router.get('/user/:userId', koleksiController.getKoleksiByUser);
router.put('/:id', koleksiController.updateKoleksi);
router.delete('/:id', koleksiController.deleteKoleksi);
router.delete('/koleksi', koleksiController.deleteByUserAndBook);

module.exports = router;