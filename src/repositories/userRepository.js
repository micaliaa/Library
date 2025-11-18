const User = require('../models/User');
const Peminjaman = require('../models/Peminjaman');

// Association antara User dan Peminjaman
User.hasMany(Peminjaman, { foreignKey: 'UserID' });
Peminjaman.belongsTo(User, { foreignKey: 'UserID' });

class UserRepository {
  async findAll(condition = {}) {
    return await User.findAll(condition);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { Email: email } });
  }

 async findAllWithActiveLoans() {
  const users = await User.findAll({
    include: [{
      model: Peminjaman,
      where: { StatusPeminjaman: 'Dipinjam' },
      required: false
    }]
  });

  return users.map(u => ({
    ...u.dataValues,
    activeLoans: u.peminjamans
      ? [...new Set(u.peminjamans.map(p => p.BukuID))].length
      : 0
  }));
}

  async create(userData) {
    return await User.create(userData);
  }

  async update(id, userData) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(userData);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }

  async count(condition = {}) {
    return await User.count(condition);
  }
}

module.exports = new UserRepository();
