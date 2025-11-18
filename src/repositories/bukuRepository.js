const { Op, fn, col } = require("sequelize");
const Buku = require("../models/Buku");
const UlasanBuku = require("../models/UlasanBuku");
const User = require("../models/User");
const KategoriRelasi = require("../models/KategoriBukuRelasi");
const Peminjaman = require("../models/Peminjaman"); // import dengan require
const KoleksiPribadi = require ('../models/KoleksiPribadi');

class BukuRepository {
  async findAll() {
    return await Buku.findAll({
      include: [
        {
          model: UlasanBuku,
          as: "Ulasan",
          attributes: [],
        },
      ],
      attributes: {
        include: [[fn("AVG", col("Ulasan.Rating")), "RataRataRating"]],
      },
      group: ["buku.BukuID"],
    });
  }

  async findLimitFive() {
    return await Buku.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(BukuID) {
    return await Buku.findByPk(BukuID, {
      include: [
        {
          model: UlasanBuku,
          as: "Ulasan",
          include: [
            {
              model: User,
              as: "User",
              attributes: ["Username"],
            },
          ],
        },
      ],
    });
  }

  async countBuku() {
    return await Buku.count();
  }

  async create(bukuData) {
    return await Buku.create(bukuData);
  }

  async update(BukuID, bukuData) {
    const buku = await Buku.findByPk(BukuID);
    if (!buku) return null;
    return await buku.update(bukuData);
  }

  async delete(BukuID) {
    const buku = await Buku.findByPk(BukuID);
    if (!buku) return null;

     await UlasanBuku.destroy({ where: { BukuID } });

   
    await Peminjaman.destroy({ where: { BukuID } });

    await KoleksiPribadi.destroy({ where: { BukuID } });

   
    await KategoriRelasi.destroy({ where: { BukuID } });


    await buku.destroy();

    return buku;
  }

  async deleteKategoriRelasi(BukuID) {
    return await KategoriRelasi.destroy({ where: { BukuID } });
  }

  async addKategoriRelasi(BukuID, KategoriIDs) {
    const data = KategoriIDs.map(id => ({ BukuID, KategoriID: id }));
    return await KategoriRelasi.bulkCreate(data);
  }

  async search(keyword) {
    return await Buku.findAll({
      where: {
        [Op.or]: [
          { Judul: { [Op.like]: `%${keyword}%` } },
          { Penulis: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });
  }
}

module.exports = new BukuRepository();
