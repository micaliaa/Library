
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const {loginController, dashbordController,forgottenPassword,resetPassword} = require('../controllers/loginController');

const authMiddleware=require('../middleware/authMiddleware')

router.post('/register', registerController.register);
router.post('/login',loginController.login);
router.get('/dashboard',authMiddleware(['Administrator','Petugas','Peminjam']), dashbordController.dashboard);
router.post("/forgot-password", forgottenPassword);
router.post("/reset-password", resetPassword)
module.exports = router;                                                