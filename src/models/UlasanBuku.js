const {DataTypes} = require ('sequelize');
const sequelize = require ('../config/databaseConfig');
const moment = require ('moment/moment');
const User = require('./User');
const Buku = require('./Buku');

const UlasanBuku= sequelize.define('ulasanbuku' , {
    UlasanId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,        
    },
    BukuId:{
        type:DataTypes.INTEGER,
       allowNull:false,
     references: {
  model: Buku,
  key: "BukuId",
},

       
    },
  Ulasan:{
    type:DataTypes.TEXT,
  },


  Rating:{
    type:DataTypes.INTEGER,
  }

},{
    tableName:"ulasanbuku", // nama tabel adalah 'user'
    timestamps:true,// Jika tabel memiliki kolom createdAt dan updatedAt
})

UlasanBuku.belongsTo(User, {foreignKey: "UserId", onDelete:"CASCADE"});
User.hasMany(UlasanBuku, {foreignKey:"UserId", onDelete:"CASCADE"});

UlasanBuku.belongsTo(Buku, {foreignKey:"BukuId"});
Buku.hasMany(UlasanBuku,{foreignKey:"BukuId"});

module.exports=UlasanBuku;