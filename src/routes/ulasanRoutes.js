const express = require('express');
const ulasanController =require('../controllers/ulasanController');
const router = express.Router();


router.post('/',ulasanController.createUlasan);
router.get('/', ulasanController.getAllUlasan);
router.get('/:id',ulasanController.getUlasanById);
router.put('/:id',ulasanController.updateUlasan);
router.delete('/:id', ulasanController.deleteUlasan);

module.exports=router;