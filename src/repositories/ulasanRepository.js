const UlasanBuku = require('../models/UlasanBuku');
const User = require('../models/User');
const Buku = require('../models/Buku');

class UlasanRepository {
  async findAll() {
    return await UlasanBuku.findAll({
      include: [
        { model: User, as: 'User', attributes: ['UserID', 'Username', 'Email'] },
        { model: Buku, as: 'Buku', attributes: ['BukuID', 'Judul', 'Penulis', 'Penerbit'] },
      ],
    });
  }

  async findById(id) {
    return await UlasanBuku.findByPk(id, {
      include: [
        { model: User, as: 'User', attributes: ['UserID', 'Username', 'Email'] },
        { model: Buku, as: 'Buku', attributes: ['BukuID', 'Judul', 'Penulis', 'Penerbit'] },
      ],
    });
  }

  async create(data) {
    return await UlasanBuku.create(data);
  }

  async update(id, data) {
    const ulasan = await UlasanBuku.findByPk(id);
    if (!ulasan) return null;
    return await ulasan.update(data);
  }

  async delete(id) {
    const ulasan = await UlasanBuku.findByPk(id);
    if (!ulasan) return null;
    await ulasan.destroy();
    return ulasan;
  }
}

module.exports = new UlasanRepository();
