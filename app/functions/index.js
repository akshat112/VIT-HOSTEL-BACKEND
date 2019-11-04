let jwt = require('jsonwebtoken');
let Student = require('../models/student');
let CleanRequest = require('../models/clean_req');
let Guard = require("../models/guard");
let Block = require("../models/block");
let { response } = require("../config");
let cookies = require('cookie');

let guard = (req, res, next) => {
    let cookie = req.query || cookies.parse(req.headers.cookie || '');//req.secret.cookie.token;
    console.log(cookie, req.params, req.query);
    if (cookie.token){
        /*jwt.verify(token, process.env.JWT_TOKEN, (err, decoded)=>{
            if (err) console.err.bind('jwt err', err);*/
            let query = {
                session: cookie.token//decoded.session,
                //uid: decoded.userId
            };
            Guard.findOne(query).populate("blockName").exec((err, data)=>{
                if (err) throw err;
                if (data){
                    req.decoded = data;
                    next();
                }else if (!data){
                    res.status(302).redirect("/page/guards/auth/");
                    //res.status(400).json(response);
                }
            });
        //})
    }else {
        response.data = "session not stablished";
        //page redirection 
        res.status(302).redirect("/page/guards/auth/");
        //status(400).json(response);
    };
};

let student = (req, res, next) => {
    let cookie = req.query || cookies.parse(req.headers.cookie || '');//req.secret.cookie.token;
    console.log(cookie, req.params, req.query);
    if (cookie.token){
        /*jwt.verify(token, process.env.JWT_TOKEN, (err, decoded)=>{
            if (err) console.err.bind('jwt err', err);*/
            let query = {
                session: cookie.token//decoded.session,
                //uid: decoded.userId
            };

            Student.findOne(query).populate('roomId').exec((err, data)=>{
                if (err) throw err;
                if (data){
                    if (data.roomId.cleanRequestId !== null){
                        CleanRequest.findById(data.roomId.cleanRequestId).populate('blockName').exec((error, clean)=>{
                            if (error) throw error;
                            data.roomId.cleanRequestId = clean;
                            //console.log(data);
                            req.decoded = data;
                            //console.log(data);
                            next();
                        });
                    }else{
                        Block.findById(data.roomId.blockName, (errors, bData)=>{
                            if (errors) throw errors;
                            //console.log(data);
                            data.roomId.blockId = bData;
                            req.decoded = data;
                            next();
                        });
                    }
                }else if (!data){
                    //page redirection 
                    res.status(302).redirect("/page/students/auth/");
                    //status(400).json(response);
                }
            });
        //})
    }else {
        //page redirection 
        res.status(302).redirect("/page/students/auth/");
        //response.data = "session not stablished";
        //res.status(400).json(response);
    };
};

module.exports = { student, guard};
