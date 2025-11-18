const userRepository = require('../repositories/userRepository');
const { comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwtUtils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("../models/User");

class LoginController {
    async login(req, res) {
        try {
            console.log("=== LOGIN DEBUG ===");
            console.log("Email dari FE:", req.body.Email);
            console.log("Password dari FE:", req.body.Password);

            const { Email, Password } = req.body;
            if (!Email || !Password) return res.status(400).json({ message: "Email dan password harus diisi" });

            const user = await userRepository.findByEmail(Email);
            if (!user) return res.status(401).json({ message: 'Email atau password salah' });

            const valid = await comparePassword(Password, user.Password);
            if (!valid) return res.status(401).json({ message: 'Email atau password salah' });
            console.log("Password benar");

            const token = generateToken(user);
            console.log("Login sukses, token dibuat:", token);
            res.status(200).json({ 
                message: 'Login berhasil', 
                data:{
                    accessToken: token,
                    Role: user.Role,
                    UserID: user.UserID,
                },
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
}

class DashbordController {
    async dashboard(req, res) {
        try {
            res.json({ message: "selamat datang" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

const forgottenPassword = async (req, res) => {
    try {
        const { Email } = req.body;
        const users = await User.findOne({ where: { Email } });
        if (!users) return res.status(400).json({ message: "Email tidak ditemukan" });

        const token = jwt.sign({ id: users.UserID }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        console.log("Reset link:", resetLink);

        res.json({ message: "Link reset password sudah dikirim ke email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ message: "Token atau password tidak boleh kosong" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update(
            { Password: hashedPassword },
            { where: { UserID: userId } }
        );

        res.status(201).json({ message: "Berhasil mengubah password" });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Token tidak cocok atau kadaluwarsa" });
    }
}

module.exports = {
    loginController: new LoginController(),
    dashbordController: new DashbordController(),
    forgottenPassword,
    resetPassword
};
