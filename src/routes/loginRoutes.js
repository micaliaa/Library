
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const {loginController, dashbordController} = require('../controllers/loginController');

const authMiddleware=require('../middleware/authMiddleware')

router.post('/register', registerController.register);
router.post('/login',loginController.login);
router.get('/dashboard',authMiddleware(['Administrator','Petugas','Peminjam']), dashbordController.dashboard)
module.exports = router;                                                