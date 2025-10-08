const kategoriRelasiController = require('../controllers/kategoriRelasiController');
const express=require('express');
const router=express.Router();

router.get('/',kategoriRelasiController.getAllKategoriRelasi);
router.get('/:id',kategoriRelasiController.getKategoriRelasiByID);
router.get('/kategori/:kategoriID',kategoriRelasiController.getKategoriRelasiByKategoriID);
router.post('/',kategoriRelasiController.createKategoriRelasi);
router.put('/:id',kategoriRelasiController.updateKategoriRelasi);
router.delete('/:id',kategoriRelasiController.deleteKategoriRelasi);

module.exports = router;