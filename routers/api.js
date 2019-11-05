const express = require('express');
const ApiRouter = express.Router();

// const commentRouter = require('./comment');
const userRouter = require('./user');
// const imageRouter = require('./image');
const authRouter = require('./auth');

ApiRouter.get('/', (req, res) =>{
    res.send('CheckImage API!');
});

// ApiRouter.use('/comments', commentRouter);
// ApiRouter.use('/images', imageRouter);

// ApiRouter.use((req, res, next) =>{
//     //check is admin
//     console.log("Block user API");
// })

ApiRouter.use('/auth', authRouter);

// ApiRouter.use((req, res, next) =>{
//     //check is super admin
//     console.log("Block user API");
// })

ApiRouter.use('/users', userRouter);


module.exports = ApiRouter;