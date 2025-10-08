const userRepository = require('../repositories/userRepository');
const { comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwtUtils');

class LoginController {
    async login(req, res) {
        try {
            const { Email, Password } = req.body;

            if (!Email || !Password) {
                return res.status(400).json({ message: "Email dan password harus diisi" });
            }

            const user = await userRepository.findByEmail(Email);
            if (!user) return res.status(401).json({ message: 'Email atau password salah' });

            const valid = await comparePassword(Password, user.Password);
            if (!valid) return res.status(401).json({ message: 'Email atau password salah' });

            const token = generateToken(user);
            res.status(200).json({ message: 'Login berhasil', token });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new LoginController();
