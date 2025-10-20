const express = require('express');
require('dotenv').config();
const sequelize = require('./src/config/databaseConfig.js');
const path=require('path')
const cors=require('cors')
    
// Import semua routes
const userRoutes = require('./src/routes/userRoutes.js');
const loginRoutes = require('./src/routes/loginRoutes.js');
const bukuRoutes=require('./src/routes/bukuRoutes.js');
const kategoriRoutes=require('./src/routes/kategoriRoutes.js');
const kategoriRelasiRoutes=require('./src/routes/kategoriRelasiRoutes.js');
const koleksiRoutes=require('./src/routes/koleksiRoutes.js');
const peminjamanRoutes=require('./src/routes/peminjamanRoutes.js');
const pengembalianRoutes=require('./src/routes/pengembalianRoutes.js')
const ulasanRoutes=require('./src/routes/ulasanRoutes.js')

const app = express();
app.use(express.json());
app.use(cors())
//file gambar dari folder 'uploads'
app.use('/uploads',express.static(path.join(__dirname,'uploads')));


app.use('/users', userRoutes);  
app.use('/akun', loginRoutes);
app.use('/buku',bukuRoutes);
app.use('/kategori',kategoriRoutes);
app.use('/kategoriRelasi',kategoriRelasiRoutes);
app.use('/koleksi',koleksiRoutes);
app.use('/peminjaman',peminjamanRoutes);
app.use('/pengembalian',pengembalianRoutes);
app.use('/ulasan',ulasanRoutes)
// Test route   
app.get('/', (req, res) => {
    res.send('API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('Database connection failed:', err));

