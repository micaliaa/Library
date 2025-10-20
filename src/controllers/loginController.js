const userRepository = require('../repositories/userRepository');
const { comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwtUtils');

class LoginController {
    async login(req, res) {
        try {
            console.log("=== LOGIN DEBUG ===");
        console.log("Email dari FE:", req.body.Email);
        console.log("Password dari FE:", req.body.Password);

        
            const { Email, Password } = req.body;

            if (!Email || !Password) {
                return res.status(400).json({ message: "Email dan password harus diisi" });
            }

            const user = await userRepository.findByEmail(Email);
            if (!user) return res.status(401).json({ message: 'Email atau password salah' });

            const valid = await comparePassword(Password, user.Password);
            if (!valid) return res.status(401).json({ message: 'Email atau password salah' });
            console.log("Password salah") 

            const token = generateToken(user);
            console.log("Login sukses,token dibuat:",token)
            res.status(200).json({ 
                message: 'Login berhasil', 
                data:{
                    accessToken:token,
                    Role:user.Role,
                    UserID:user.UserID,
                },
             });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

class DashbordController{
    async dashboard(req, res) {
        try {
            res.json({message : "selamat datang"})
        } catch (error) {
            res.status(500).json({error : error.message})
        }
    }
}

module.exports = {
    loginController : new LoginController(),
    dashbordController : new DashbordController()
};
