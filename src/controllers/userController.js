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

  
    async getAllPeminjam(req, res) {
        try {
            const peminjam = await userRepository.findAll({
                where: { Role: 'Peminjam' }
            });
            res.status(200).json(peminjam);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getAllPetugas(req, res) {
        try {
            const petugas = await userRepository.findAll({
                where: { Role: 'Petugas' }
            });
            res.status(200).json(petugas);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getCountByRole(req,res){
        try{
            const totalPeminjam=await userRepository.count({where:{Role:'Peminjam'} });
            const totalPetugas=await userRepository.count({where:{Role:'Petugas'}});
            const totalAdmin=await userRepository.count({where:{Role:'Administrator'}});

            res.status(200).json({
                totalPeminjam,
                totalPetugas,
                totalAdmin
            })
        }catch(err){
            res.status(500).json({message:err.message})
        }
    }

    
   async getAllBorrowers(req, res) {
  try {
    const users = await userRepository.findAllWithActiveLoans();
    res.status(200).json(users);
  } catch (err) {
    console.error("ERROR getAllBorrowers:", err);
    res.status(500).json({ message: err.message });
  }
}


   async createUser(req, res) {
  try {
    const {
      Username = null,
      Password = null,
      Email,
      NamaLengkap,
      Alamat = null,
      Role
    } = req.body;

    const creatorRole = req.user?.Role; // role dari pembuat (hasil decode JWT)

    // Validasi field wajib
    if (!Email || !NamaLengkap || !Role) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    // Validasi role
    const validRoles = ['Administrator', 'Peminjam', 'Petugas'];
    if (!validRoles.includes(Role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    // Cek email duplikat
    const existingUser = await userRepository.findByEmail(Email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    let plainPassword = Password;
    let hashedPassword;

    // 🔐 Logika password berdasarkan role & siapa yang buat
    if (Role === 'Peminjam') {
      if (!Password && creatorRole !== 'Administrator') {
        // Kalau peminjam daftar sendiri → wajib isi password
        return res.status(400).json({ message: "Password wajib untuk peminjam" });
      }
      // Kalau dibuat oleh admin → auto generate password
      plainPassword = Password || Math.random().toString(36).slice(-8);
      hashedPassword = await hashPassword(plainPassword);
    } else {
      // Untuk Petugas / Admin → password bisa kosong (generate otomatis)
      plainPassword = Password || Math.random().toString(36).slice(-8);
      hashedPassword = await hashPassword(plainPassword);
    }

    // Simpan user baru
    const newUser = await userRepository.create({
      Username,
      Password: hashedPassword,
      Email,
      NamaLengkap,
      Alamat,
      Role,
    });

    // Hindari kirim password hash ke client
    const userResponse = {
      id: newUser.id,
      Username: newUser.Username,
      Email: newUser.Email,
      NamaLengkap: newUser.NamaLengkap,
      Alamat: newUser.Alamat,
      Role: newUser.Role,
    };

    // Kembalikan password plaintext hanya kalau dibuat oleh admin
    const response = {
      message: 'User created successfully',
      user: userResponse,
    };

    if (creatorRole === 'Administrator') {
      response.temporaryPassword = plainPassword;
    }

    res.status(201).json(response);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


    async updateUser(req, res) {
        try {
            const updatedUser = await userRepository.update(req.params.id, req.body);
            if (!updatedUser) return res.status(404).json({ message: 'User not found' });
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
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
