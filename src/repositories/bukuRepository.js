const { Op, fn, col } = require("sequelize");
const sequelize = require("../config/databaseConfig");
const Buku = require("../models/Buku");
const UlasanBuku = require("../models/UlasanBuku");
const User = require("../models/User");

class BukuRepository {
  async findAll() {
    try {
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
        group: ["buku.BukuID"], // ✅ pakai alias model, bukan col()
      });
    } catch (err) {
      console.error("🔥 ERROR di findAll BukuRepository:", err);
      throw err;
    }
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
    await buku.destroy();
    return buku;
  }

  // 🔍 Fungsi search
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
