const { Op } = require("sequelize");
const Buku = require("../models/Buku");

class BukuRepository {
    async findAll() {
        return await Buku.findAll();
    }

    async findLimitFive() {
        return await Buku.findAll({
            limit: 5,   
            order: [['createdAt', 'DESC']]
        });
    }

    async findById(BukuID) {
        return await Buku.findByPk(BukuID);
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

    //fungsi search
    async search(keyword) {
        return await Buku.findAll({
            where: {
                [Op.or]: [
                    { Judul: { [Op.like]: `%${keyword}%` } },
                    { Penulis: { [Op.like]: `%${keyword}%` } }
                ]
            }
        });
    }
}

module.exports = new BukuRepository();
