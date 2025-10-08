// bisa menerima satu atau beberapa role yang diperbolehkan
const permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!allowedRoles.includes(req.user.Role)) {
      return res.status(403).json({ message: `Access denied: ${allowedRoles.join(', ')} only` });
    }

    next();
  };
};

module.exports = { permitRoles };
