const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/bcrypt');

class RegisterController {
    async register(req, res) {
        try {
            const { Username, Password, Email, NamaLengkap, Alamat,} = req.body;

            // Validasi field
            if (!Username || !Password || !Email || !NamaLengkap || !Alamat) {
                return res.status(400).json({ message: "Semua field harus diisi" });
            }

        
            // Cek email duplikat
            const existingUser = await userRepository.findByEmail(Email);
            if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

            // Hash password
            const hashed = await hashPassword(Password);

            // Simpan user baru
            const newUser = await userRepository.create({
                Username,
                Password: hashed,
                Email,
                NamaLengkap,
                Alamat,
             
            });

            res.status(201).json({ message: 'User berhasil dibuat', user: newUser });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new RegisterController();
