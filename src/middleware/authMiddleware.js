const { verifyToken } = require('../utils/jwtUtils');
const userRepository = require('../repositories/userRepository');

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Token dibutuhkan" });
  
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token tidak ada' });

    try {
      const decoded = verifyToken(token);
      const user = await userRepository.findById(decoded.UserID);
      if (!user) return res.status(401).json({ message: "User tidak ditemukan" });
    
      req.user = user;
    
      if (allowedRoles.length && !allowedRoles.includes(user.Role)) {
        return res.status(403).json({ message: "Akses ditolak: role tidak diizinkan" });
      }

      console.log("Decoded token:", decoded);
      console.log("User dari DB:", user);

      next();
    } catch (err) {
      res.status(401).json({ message: "Token tidak valid" });
    }
  };
};

module.exports = authMiddleware;
