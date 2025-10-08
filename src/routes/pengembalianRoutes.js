const express = require('express');
const pengembalianController =require('../controllers/pengembalianController');
const router = express.Router();


router.post('/', pengembalianController.createPengembalian);
router.get('/', pengembalianController.getAllPengembalian);
router.get('/:id', pengembalianController.getPengembalianById);
router.get('/user/:userId', pengembalianController.getPengembalianByUserId);
router.put('/:id', pengembalianController.updatePengembalian);
router.delete('/:id', pengembalianController.deletePengembalian);

module.exports=router;