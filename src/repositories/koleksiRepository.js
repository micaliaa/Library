const KoleksiPribadi = require('../models/KoleksiPribadi');
const Buku = require('../models/Buku');
const { fn, literal } = require('sequelize');

class KoleksiRepository {

  async findAll() {
    return await KoleksiPribadi.findAll({ include: [Buku] });
  }

  async findById(id) {
    return await KoleksiPribadi.findByPk(id, { include: [Buku] });
  }

  async findByUserId(UserID) {
  if (!UserID) {
    console.warn('⚠️ UserID kosong di findByUserId');
    return [];
  }

    const koleksi = await KoleksiPribadi.findAll({
      where: { UserID },
      include: [
        {
          model: Buku,
          as:"buku",
          attributes: [
            'BukuID',
            'Judul',
            'Penulis',
            'Penerbit',
            'TahunTerbit',
            'Gambar',
            [
              literal(`(
                SELECT COALESCE(AVG("u"."Rating"), 0)
                FROM "ulasanbuku" AS "u"
                WHERE "u"."BukuID" = "buku"."BukuID"
              )`),
              'RataRataRating'
            ]
          ]
        }
      ]
    });

console.log('=== HASIL KOLEKSI ===');
console.log(JSON.stringify(koleksi, null, 2)); // <-- ini yang penting


    return koleksi;
  }

  async create(koleksiData) {
    return await KoleksiPribadi.create(koleksiData);
  }

  async update(id, koleksiData) {
    const koleksi = await KoleksiPribadi.findByPk(id);
    if (!koleksi) return null;
    return await koleksi.update(koleksiData);
  }

  async delete(id) {
    const koleksi = await KoleksiPribadi.findByPk(id);
    if (!koleksi) return null;
    await koleksi.destroy();
    return koleksi;
  }
}

module.exports = new KoleksiRepository();
