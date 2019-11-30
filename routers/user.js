const express = require('express');
const UserRouter = express.Router();
const userModel = require('../models/users');

const bcrypt = require('bcrypt');


//CRUD
//Create
UserRouter.post('/adduser', (req , res) =>{
    const { username, email, password, fullname} = req.body;
    
    const hashPassword = bcrypt.hashSync(password, 12);

    userModel.create({username, email, password: hashPassword, fullname})
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
UserRouter.put('/updatepassword')
//delete



module.exports = UserRouter;