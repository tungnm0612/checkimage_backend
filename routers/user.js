const express = require('express');
const UserRouter = express.Router();
const userModel = require('../models/users');

const bcrypt = require('bcrypt');


//CRUD
//Create
UserRouter.post('/adduser', (req , res) =>{
    const { username, email, password, fullname} = req.body;
    
    const hashPassword = bcrypt.hashSync(password, 12);

    userModel.create({username, email, password: hashPassword, fullname, disabled: false})
        .then(userCreated =>{
            // console.log(userCreated);
            res.status(201).json({
                success: true,
                message: "Tạo tài khoản thành công!",
                data: userCreated,
            })
        }).catch(error =>{
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Tạo tài khoản không thành công!",
                error,
            })
    })
});

//get list
UserRouter.get('/getalluser', (req, res) => {
    userModel.find({})
        .then(userList =>{
            res.json({
                success: true,
                data: userList,
            })
        }).catch(err =>{
            console.log(err)
            res.status(500).json({
                success: false,
                err
            });
        });
});

//get one
UserRouter.get('/getoneuser/:id', (req, res) =>{
    userModel.findById(req.params.id)
        .then(oneUser =>{
            res.json({
                success: true,
                data: oneUser
            });
        }).catch(err =>{
            res.status(500).json({
                success: false,
                err
            });
        });
});
//update
UserRouter.put('/updatepassword', (req, res) =>{
    const {idUser, newpassword} = req.body;
    const hashPassword = bcrypt.hashSync(newpassword, 12);
    userModel.findByIdAndUpdate(idUser, {password: hashPassword})
        .then(passwordUpdate => {
            res.send({
                success: true,
                message: "Đã đổi mật khẩu thành công!",
            })
        }).catch(err => {
            console.log(err)
        })
})

// UserRouter.put('/updatepassword')

UserRouter.put('/active', (req, res) =>{
    const {idUser, active} = req.body;
    if (active === false) {
        userModel.findByIdAndUpdate(idUser, {disabled: true})
            .then(dataUser => {
                // console.log(dataUser)
                res.send({
                    success: true,
                    message: "Đã tắt hoạt động của tài khoản " + dataUser.username + " !"
                })
            }).catch(err =>{
                console.log(err);
            })
    } else {
        if (active === true) {
            userModel.findByIdAndUpdate(idUser, {disabled: false})
            .then(dataUser => {
                console.log(dataUser.disabled)
                res.send({
                    success: true,
                    message: "Đã bật hoạt động của tài khoản " + dataUser.username + " !"
                })
            }).catch(err =>{
                console.log(err);
            })
        }
    }
})
//delete



module.exports = UserRouter;