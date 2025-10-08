const {DataTypes} = require ('sequelize');
const sequelize = require ('../config/databaseConfig');
const User = require('./User');
const Buku = require('./Buku');

const UlasanBuku= sequelize.define('ulasanbuku' , {
    UlasanID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,        
    },
    BukuID:{
        type:DataTypes.INTEGER,
       allowNull:false,
     references: {
  model: Buku,
  key: "BukuId",
},
  UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', 
          key: 'UserID',
        }

      }
    },
  Ulasan:{
    type:DataTypes.TEXT,
  },


  Rating:{
    type:DataTypes.INTEGER,
  }

},{
    tableName:"ulasanbuku", 
    timestamps:true,
})

UlasanBuku.belongsTo(User, {foreignKey: "UserID", onDelete:"CASCADE"});
User.hasMany(UlasanBuku, {foreignKey:"UserID", onDelete:"CASCADE"});

UlasanBuku.belongsTo(Buku,{foreignKey:"BukuID"});
Buku.hasMany(UlasanBuku,{foreignKey:"BukuID"});

module.exports=UlasanBuku;