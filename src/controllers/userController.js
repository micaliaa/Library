const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/bcrypt');

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userRepository.findAll();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await userRepository.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async createUser(req, res) {
        try {
            console.log(req.body)
            const {Username,Password,Email,NamaLengkap,Alamat,Role}=req.body;

         if (!Username || !Password || !Email || !NamaLengkap || !Alamat) {
                return res.status(400).json({ message: "Semua field harus diisi" });
            }

          // Validasi role
            const validRoles = ['Administrator', 'Peminjam']; // sesuaikan role
            if (!validRoles.includes(Role)) {
                return res.status(400).json({ message: "Role tidak valid" });
            }

             // Cek email duplikat
                        const existingUser = await userRepository.findByEmail(Email);
                        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });
            
                        // Hash password
                        const hashed = await hashPassword(Password);
            

              const newUser=await userRepository.create({
                Username,
                Password,
                Email,
                NamaLengkap,
                Alamat,
                Role,
            })

            res.status(201).json({
                message:'User Created Succesfully',
                user:newUser,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

      async updateUser(req, res) {
        try {
            const updatedUser = await userRepository.update(req.params.id, req.body);
            if (!updatedUser) return res.status(404).json({message: 'User not found'});
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await userRepository.delete(req.params.id);
            if (!deletedUser) return res.status(404).json({ message: 'User not found' });
            res.json({ message: 'User deleted', data: deletedUser });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new UserController();
