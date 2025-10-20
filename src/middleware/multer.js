const multer=require('multer');
const path=require('path');
const fs=require('fs');

//memastikan folder 'uploads' ada
const uploadDir='uploads';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);   
}

//konfig pengimpanan file
const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir);//folder tempat menyimpan file
    },
    filename:(req,file,cb)=>{
        const originalName=req.body.JudulFoto||'file';//
        const sanitizedOriginName=originalName.replace(/[^a-zA-Z0-9]/g,'_');
        cb(
            null,
            sanitizedOriginName + '_' +Date.now() + path.extname(file.originalname)
        );
    },
});

//filter utk memastikan hanya file gambar yg diterima
const fileFilter=(req,file,cb)=>{
    const allowedTypes=/jpg|jpeg|png/;
    const extname=allowedTypes.test(path.extname(file.originalname.toLowerCase()));
    const mimetype=allowedTypes.test(file.mimetype);

    if (extname,mimetype){
        return cb(null,true);

    }else{
        cb(new Error('Hanya file Gambar yang diperbolehkan!'));
    }
};


const upload = multer({
    storage,
    fileFilter,
});

module.exports=upload;