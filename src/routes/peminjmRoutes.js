const express = require('express');
const router = express.Router();
const peminjamController = require('../../../mg/peminjamController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/profile', authMiddleware, peminjamController.profile);
router.put('/profile', authMiddleware, peminjamController.updateProfile);

module.exports = router;
