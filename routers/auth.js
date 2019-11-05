const express  = require('express');
const AuthRouter = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/users');
const jwt = require('jsonwebtoken');

const jwtSecret = "qweqweqweqwe"

//Authentication
//login
AuthRouter.post('/login', (req, res) =>{
    //TODO:
    // - Get username, pasword from request
    const {username, password} = req.body;
    // - Check if user with username exist
    // - Compare password
    // -
    if (!username || !password){
        res.json({
            success: 0 ,
            message: 'thiếu username hoặc password'
        })
    }

    userModel.findOne({ username })
    .then(userFound =>{
        if (!userFound || !userFound._id){
            res.json({
                success: 0,
                message: 'Không tồn tại người dùng!'
            })
            } else{
                if(bcrypt.compareSync(password,userFound.password)){
                    // login with session
                    // req.session.user = {
                    //     username,
                    //     id: userFound._id,
                    // };

                    //login with jwt
                    const access_token = jwt.sign({ username, id: userFound._id }, jwtSecret);

                    res.json({
                        success: 1,
                        message: 'Đăng nhập thành công!',
                        access_token,
                        user:{
                            username,
                            id: userFound._id
                        }
                    })
                } else{
                    res.json({
                        success: 0,
                        message: 'Sai mật khẩu!'
                    })
                }
            }
    }).catch(err => {
        res.json({
            success: 0,
            message: 'Đã có lỗi xảy ra!'
        })
    })
})

//logout with session
// AuthRouter.delete('/logout', (req, res) =>{
//     req.session.user = null;
//     req.session.destroy();
//     res.json({
//         success: 1,
//         message: 'Đăng xuất thành công!'
//     });
// });

AuthRouter.get('/check', (req, res) =>{
    const access_token = req.query.access_token;

    const decode = jwt.verify(access_token, jwtSecret);
    console.log(decode);
    
    try{
        if(decode && decode.id){
            res.send({
                success: 1,
                message: 'Nguoi dung da dang nhap',
                user: decode
            });
        } else{
            res.send({
                success: 0,
                message: 'Nguoi dung chua dang nhap'
            });
        };
    } catch(error){
        console.log(error);
        res.send({
            success: 0,
            message: 'Token khong dung'
        });
    }
    
    // if(req.session.user){
        // res.send({
        //     success: 1,
        //     message: 'Nguoi dung da dang nhap',
        //     user: req.session.user
        // });
    // } else {
        // res.send({
        //     success: 0,
        //     message: 'Nguoi dung chua dang nhap'
        // })
    // }
})
module.exports = AuthRouter;