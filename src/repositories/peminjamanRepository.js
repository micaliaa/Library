const Peminjaman = require('../models/Peminjaman');
const User = require('../models/User');
const Buku = require('../models/Buku');
const { literal, Op } = require('sequelize'); 

class PeminjamanRepository {
  //  Ambil semua data peminjaman
  async findAll() {
    try {
      const peminjaman = await Peminjaman.findAll({
        include: [
          { model: User, attributes: ['UserID', 'NamaLengkap', 'Email'] },
          { 
            model: Buku,
            attributes: [
              'BukuID', 'Judul', 'Penulis', 'Penerbit', 'TahunTerbit', 'Gambar',
              [literal(`(
                SELECT COALESCE(AVG("Rating"), 0)
                FROM "ulasanbuku"
                WHERE "ulasanbuku"."BukuID" = "buku"."BukuID"
              )`), 'RataRataRating']
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

         const now = new Date();
    for (const p of peminjaman) {
      const tanggalPinjam = new Date(p.TanggalPeminjaman);
      const batasPengembalian = new Date(tanggalPinjam);
      batasPengembalian.setDate(batasPengembalian.getDate() + 7);

      if (!p.TanggalPengembalian && now > batasPengembalian && p.StatusPeminjaman !== "Overdue") {
        await p.update({ StatusPeminjaman: "Overdue" });
      }
    }



      return peminjaman;
    } catch (err) {
      console.error('Error in PeminjamanRepository.findAll():', err);
      throw err; // lempar error biar controller bisa tangkap
    }
  }

  //  Ambil peminjaman berdasarkan ID
  async findById(id) {
    try {
      return await Peminjaman.findByPk(id, { include: [User, Buku] });
    } catch (err) {
      console.error('Error in findById:', err);
      throw err;
    }
  }

  //  Ambil semua peminjaman berdasarkan UserID
  async findByUserID(UserID) {
    try {
      return await Peminjaman.findAll({
        where: { UserID },
        include: [
          {
            model: Buku,
            attributes: [
              'BukuID', 'Judul', 'Penulis', 'Penerbit', 'TahunTerbit', 'Gambar',
              [literal(`(
                SELECT COALESCE(AVG("Rating"), 0)
                FROM "ulasanbuku"
                WHERE "ulasanbuku"."BukuID" = "buku"."BukuID"
              )`), 'RataRataRating']
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } catch (err) {
      console.error('Error in findByUserID:', err);
      throw err;
    }
  }

  async create(data) {
    try {
      return await Peminjaman.create(data);
    } catch (err) {
      console.error('Error in create:', err);
      throw err;
    }
  }

  async update(id, data) {
    try {
      const peminjaman = await Peminjaman.findByPk(id);
      if (!peminjaman) return null;
      return await peminjaman.update(data);
    } catch (err) {
      console.error('Error in update:', err);
      throw err;
    }
  }

  async delete(id) {
    try {
      const peminjaman = await Peminjaman.findByPk(id);
      if (!peminjaman) return null;
      await peminjaman.destroy();
      return peminjaman;
    } catch (err) {
      console.error('Error in delete:', err);
      throw err;
    }
  }

  async countPeminjaman() {
    try {
      return await Peminjaman.count();
    } catch (err) {
      console.error('Error in countPeminjaman:', err);
      throw err;
    }
  }
  async countActivePeminjaman() {
  try {
    // Hitung peminjaman yang TanggalPengembalian masih di masa depan
    return await Peminjaman.count({
      where: {
        TanggalPengembalian: { [Op.gt]: new Date() }
      }
    });
  } catch (err) {
    console.error('Error in countActivePeminjaman:', err);
    throw err;
  }
}

async countActiveByUser(UserID) {
  try {
    return await Peminjaman.count({
      where: {
        UserID,
        TanggalPengembalian: null
      }
    });
  } catch (err) {
    console.error('Error in countActiveByUser:', err);
    throw err;
  }
}

}

module.exports = new PeminjamanRepository();
