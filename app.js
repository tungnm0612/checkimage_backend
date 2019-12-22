const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const session = require('express-session');
// const jwt = require('jsonwebtoken');

const apiRouter = require('./routers/api');

const app = express();

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000*60*60*24*7
//     }
// }));



app.use(
    // Middleware
    (req, res, next) =>{
    // console.log(req.session);
    // console.log(req.sessionID);
    return next();
    // const jwtSecret = "qweqweqweqwe"
    // const access_token = req.query.access_token;

    // if(!req.query.access_token){
    //     res.send({
    //         success: 0,
    //         message: "thieu token",
    //     })
    // }
    
    // try{
    //     const decode = jwt.verify(access_token, jwtSecret);
    //     if(decode && decode.id){
    //         req.use = decode;
    //         next();
    //     } else{
    //         res.send({
    //             success: 0,
    //             message: 'Nguoi dung chua dang nhap'
    //         });
    //     };
    // } catch(error){
    //     console.log(error);
    //     res.send({
    //         success: 0,
    //         message: 'Token khong dung'
    //     });
    // }
});

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "https://originalphotos.herokuapp.com"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://originalphotos.herokuapp.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors({ origin: ['http://localhost:3000', 'https://originalphotos.herokuapp.com'], credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// mongodb://<dbuser>:<dbpassword>@ds241258.mlab.com:41258/checkimage
mongoose.connect('mongodb://admin:admin1@ds241258.mlab.com:41258/checkimage', (err) => {
    if(err) console.log(err)
    else console.log("DB connect success!")
});
mongoose.set('useFindAndModify', false);
app.use('/api', apiRouter);


app.listen(process.env.PORT || 6969, (err) =>{
    if(err) console.log(err)
    else console.log("Server start success!")
})