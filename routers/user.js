const express = require('express');
const UserRouter = express.Router();
const userModel = require('../models/users');

const bcrypt = require('bcrypt');


//CRUD
//Create
UserRouter.post('/', (req , res) =>{
    const { username, email, password} = req.body;
    
    const hashPassword = bcrypt.hashSync(password, 12);

    userModel.create({username, email, password: hashPassword})
        .then(userCreated =>{
            // console.log(userCreated);
            res.status(201).json({
                success: true,
                data: userCreated,
            })
        }).catch(error =>{
            console.log(error);
            res.status(500).json({
                success: false,
                error,
            })
    })
});

//get list
UserRouter.get('/', (req, res) => {
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
UserRouter.get('/:id', (req, res) =>{
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

//delete



module.exports = UserRouter;