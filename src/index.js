const express = require ('express');
require('dotenv').config();
const sequelize=require('./config/databaseConfig.js')


const app = express();
app.use(express.json());

//sinkronisasi model
sequelize.sync({force:false})
.then(()=>console.log("Database Syncronized"))
.catch(err=>console.error("Error syncing:",err))

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
});



