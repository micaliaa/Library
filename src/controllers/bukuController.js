const bukuRepository = require('../repositories/bukuRepository');
const fs = require('fs');

class BukuController {
  async getAllBooks(req, res) {
    try {
      const books = await bukuRepository.findAll();
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getRekomendBooks(req, res) {
    try {
      const books = await bukuRepository.findLimitFive();
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getBookById(req, res) {
    try {
      const book = await bukuRepository.findById(req.params.BukuID);
      if (!book) return res.status(404).json({ message: 'Book not found' });
      return res.status(200).json(book);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createBook(req, res) {
  try {
    const { Judul, Penulis, Penerbit, TahunTerbit, KategoriIDs } = req.body;
    const Gambar = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const newBuku = await bukuRepository.create({
      Judul,
      Penulis,
      Penerbit,
      TahunTerbit,
      Gambar,
    });

    // Tambahkan relasi kategori
    const kategoriArray = Array.isArray(KategoriIDs)
      ? KategoriIDs
      : JSON.parse(KategoriIDs || "[]");

    if (kategoriArray.length > 0) {
      await bukuRepository.addKategoriRelasi(newBuku.BukuID, kategoriArray);
    }

    res.status(201).json(newBuku);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  async updateBook(req, res) {
    try {
      const BukuID = req.params.BukuID;
      const { Judul, Penulis, Penerbit, TahunTerbit } = req.body;
      let Gambar = req.file ? req.file.path.replace(/\\/g, '/') : undefined;

      const oldBook = await bukuRepository.findById(BukuID);
      if (!oldBook) return res.status(404).json({ message: 'Buku tidak ditemukan' });

      if (Gambar && oldBook.Gambar && fs.existsSync(oldBook.Gambar)) {
        fs.unlinkSync(oldBook.Gambar);
      } else if (!Gambar) {
        Gambar = oldBook.Gambar;
      }

      const updateBook = await bukuRepository.update(BukuID, {
        Judul,
        Penulis,
        Penerbit,
        TahunTerbit,
        Gambar,
      });
      if (!updateBook) return res.status(404).json({ message: 'Gagal memperbarui buku' });

      // Update kategori buku
      const { KategoriIDs } = req.body;
      const kategoriArray = Array.isArray(KategoriIDs)
        ? KategoriIDs
        : JSON.parse(KategoriIDs || "[]");

      await bukuRepository.deleteKategoriRelasi(BukuID);
      await bukuRepository.addKategoriRelasi(BukuID, kategoriArray);

      res.json({
        BukuID,
        Judul,
        Penulis,
        Penerbit,
        TahunTerbit,
        Gambar,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async deleteBook(req, res) {
    try {
      const BukuID = req.params.BukuID;
      const deletedBook = await bukuRepository.delete(BukuID);
      if (!deletedBook) return res.status(404).json({ message: 'Book not found' });

      res.json({ message: 'Book and related data deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  async searchBooks(req, res) {
    try {
      const keyword = req.params.keyword;
      const results = await bukuRepository.search(keyword);
      res.json(results);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getCountBuku(req, res) {
    try {
      const totalBuku = await bukuRepository.countBuku();
      res.status(200).json({ totalBuku });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new BukuController();
