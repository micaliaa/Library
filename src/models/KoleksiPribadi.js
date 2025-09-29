const {DataTypes} = require("sequelize");
const sequelize = require("../config/databaseConfig");
const moment = require('moment/moment');
const User = require('./User');
const Buku = require('./Buku');
const KoleksiPribadi=sequelize.define('koleksipribadi',{

    KoleksiID:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        
    },
    UserID:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:"UserID",
        },

    },
    BukuID:{
        type:DataTypes.INTEGER,
        references:{
            model:Buku,
            key:"BukuID",

        },

    }
},{
    tableName:"koleksipribadi",
    timestamps:true,
}
);

KoleksiPribadi.belongsTo(User,{foreignKey:"UserID",onDelete:"CASCADE"});
User.hasMany(KoleksiPribadi,{forgeinKey:"UserID",onDelete:"CASCADE"});

KoleksiPribadi.belongsTo(Buku, {forgeinKey:"BukuID"});
Buku.hasMany(KoleksiPribadi,{forgeinKey:"BukuID"});

module.exports = KoleksiPribadi;