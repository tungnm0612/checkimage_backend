const fs = require('fs');
const express = require('express');
const ImageRouter = express.Router();
const imageModel = require('../models/images');
const multer = require('multer');
const md5File = require('md5-file');
const userModel = require('../models/users');

//CRUD

//Create
//upload image
const imageUploader = multer({ dest: 'ImageUpload/' })

ImageRouter.post('/uploadimage', imageUploader.single('uploadimage'), (req, res) => {
    const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);

    const idUser = req.body.uploadimage;
    // console.log(req.body);

    md5File(newFullPath, (err, hash) => {
        if (err) throw err
        console.log("mã hash upload là: " + hash)
        imageModel.create({ idUser,hashImage: hash})
        .then(imageCreated =>{
                res.status(201).json({
                    success: true,
                    message: "Upload ảnh thành công!",
                    data: imageCreated,
                })
                console.log("đã lưu mã hash vào DB")
        }).catch(err =>{
            console.log(err);
            res.status(500).json({
                success:false,
                message: "Upload ảnh không thành công!",
                err,
            })
        })
        // Xóa file ảnh sau khi mã hóa md5
        // fs.unlinkSync(newFullPath);
        // console.log("đã xóa ảnh trong folder ImageUpload")
      })
    res.send({
        status: true,
        message: 'file uploaded',
        fileNameInServer: newFullPath
    })
})

// Check Image
const imageChecker = multer({ dest: 'ImageCheck/' })

ImageRouter.post('/checkimage', imageChecker.single('checkimage'), (req, res) => {
    const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
    let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
    orgName = orgName.trim().replace(/ /g, "-")
    const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
    // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
    const newFullPath = `${fullPathInServ}-${orgName}`;
    fs.renameSync(fullPathInServ, newFullPath);

    md5File(newFullPath, (err, hash) => {
        if (err) throw err
        console.log("mã hash check: " + hash)
        imageModel.find({hashImage: hash}, (err, data) =>{
            if(data.length == 0){
                console.log("không tìm thấy mã hash");
                res.send({
                    status: false,
                    message: 'Ảnh của bạn không phải là ảnh nguyên gốc'
                })
                return
            } else{
                console.log("mã hash có id là: " + data[0]._id);
                console.log("mã hash la của user co id la: " + data[0].idUser);
                userModel.find({_id: data[0].idUser}, (err, dataUser) =>{
                    if(dataUser.length == 0){
                        console.log("Khong tim thay user");
                        return
                    } else {
                        console.log("user co email la: " + dataUser[0].email)
                        res.send({
                            status: true,
                            message: 'Ảnh của bạn là ảnh nguyên gốc',
                            infoPhotographer: {
                                email: dataUser[0].email,
                                fullname: dataUser[0].fullname
                            }
                        })
                    }
                })
            }
        })
        // Xóa file ảnh sau khi mã hóa md5
        fs.unlinkSync(newFullPath);
        console.log("đã xóa ảnh trong folder ImageCheck")
      })
    // res.send({
    //     status: true,
    //     message: 'file uploaded',
    //     fileNameInServer: newFullPath
    // })
})


module.exports = ImageRouter;