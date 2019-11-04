let express = require('express');
let router = express.Router();
let Student = require('../models/student');
let Rooms = require('../models/room');
let Request = require('../models/clean_req');
let Feedback = require('../models/feedback');
let Complain = require('../models/complains');
let Block = require("../models/block");
let { student } = require('../functions');
let { response, validRes, COOKIES_AGE } = require("../config");
let uuidv1 = require('uuid/v1');
let cookie = require('cookie');

//student registration and login
router.post('/', function(req, res) {
    let body = req.body;

    body.num = Number(body.num);
    body.bed = Number(body.bed);  
    body.type = (body.type).toUpperCase();
    body.block = (body.block).toUpperCase();
    body.name = (body.name).toUpperCase();
    body.registerNumber = (body.registerNumber).toUpperCase();
    
    const dataFind = {
        name: body.name,
        registerNumber: body.registerNumber
    };
    let roomId = (body.type === "BOYS") ? 'B':'G';
    roomId += String(body.bed) + body.block + String(body.num);

    let sessionValue = uuidv1();
    
    if (((body.block).length != 1) ||  isNaN(body.num) || isNaN(body.bed)) 
        res.status(400).json(response);

    else{
        let lock = true;
        Student.create(dataFind, (err, data)=>{
            try { 
                if (err) throw err;
                res.setHeader('Set-Cookie', cookie.serialize('token', String(sessionValue), {
                    maxAge: COOKIES_AGE,
                    path: '/students/'
                }));
                validRes.data = data;
                validRes.data.session = sessionValue;
                res.json(validRes);//status(302).redirect('/page/students/dashboard');
            }catch(err){
                if (err.name === 'MongoError' && err.code === 11000){
                    lock = false;
                    Student.findOneAndUpdate(dataFind, {$set: {'session': sessionValue}}, (err, data) =>{
                        if (err) throw err;
                        res.setHeader('Set-Cookie', cookie.serialize('token', String(sessionValue), {
                            maxAge: COOKIES_AGE,
                            path: '/students/'
                        }));
                        validRes.data = data;
                        validRes.data.session = sessionValue;
                        res.json(validRes);
                        //req.msg = data;
                        //res.render(validRes);
                    });
                }else{
                    //clear cookies
                    console.log(err);
                    response.data = "Something happening wrong with database";
                    res.json(response);
                }
            }
        });

        if (lock){
            body.name = body.registerNumber = null;
            body.roomId = roomId;
            let tData;
            Block.findOne({block: body.block}, "blockId", (err, bData)=>{
                if (err) throw err;
                body.blockName = bData._id;
                Rooms.create(body, (error, rData) => {
                    try{
                        if (error) throw error;
                        if (rData)
                            tData = rData;
                        Student.findOneAndUpdate(dataFind, {$set: {'session': sessionValue, 'roomId': tData._id}}, err =>{
                            if (err) throw err;
                        });
                    }catch(error){
                        if (error.name === 'MongoError' && error.code === 11000){
                            Rooms.findOne(body, (err, data)=>{
                                if (err) throw err;
                                tData = data;
                                Student.findOneAndUpdate(dataFind, {$set: {'session': sessionValue, 'roomId': tData._id}}, err =>{
                                    if (err) throw err;
                                });
                            });
                        }
                    }
                });
            });
        }
    }
});

router.use(student);

//student profile
router.get('/profile', (req, res)=>{
    validRes.data = req.decoded;
    res.json(validRes);
});

//receive request for room cleaning
router.get('/clean/request/', (req, res)=>{
    let data = req.decoded;
    if (data.roomId.cleanRequestId !== null){
        response.data = data;
        res.json(response);
    }else{
        //uncomment this line for production
        validRes.data = data;//"done";
        res.json(validRes);
        const roomClean = {
            requestBy: data._id, 
            uid: `${uuidv1()}`,
            roomNum: data.roomId._id, 
            blockName: data.roomId.blockName._id,
            token: `${uuidv1().slice(1,7)}${Math.floor(Math.random()*10)}`};
        Request.create( roomClean, (errs, newReq) => {
            try{
                if (errs) throw errs;
                Rooms.findByIdAndUpdate(data.roomId._id, {$set: {cleanRequestId: newReq._id}}, (error) =>{
                    if (error) console.error.bind('MongoDb error', error);
                });
            }catch (err){
                response.data = "Something happening wrong with database";
                res.json(response);
                console.log(err);
            }
        });
    }
});

//room cleaning is done according to student
router.post('/clean/request/complete', (req, res)=>{
    let data = req.decoded;
    console.log(req.body.bribe, typeof(req.body.bribe), data);
    if (req.body.bribe){
        //here checking for is request value is support null value or not
        if (data.roomId.cleanRequestId === null){
            response.data = "invalid requests";
            res.status(400).json(response);
        }else{
            //uncomment the last line
            validRes.data = data.roomId.cleanRequestId;//request.token;
            res.json(validRes);
            //let time = new Date();
            let valueUpdate = {
                status: true,
                bribe: ((req.body.bribe == "true") ? true : false)
            };
            console.log(((req.body.bribe == "true") ? true : false), valueUpdate);
            Request.findByIdAndUpdate(data.roomId.cleanRequestId._id, {$set: valueUpdate}, err =>{
                if (err) console.error.bind('MongoDb error', err);
            });
            let newQuery = {
                num: data.num,
                block: data.block
            };
            Rooms.findByIdAndUpdate(data.roomId._id, {$set: {cleanRequestId: null}}, error =>{
                if (error) console.error.bind('MongoDb error', error);
            });
        }
    }else{
        response.data = "invalid request";
        res.status(400).json(response);
    }    
});

//taking feedback from student regarding app
router.post('/app/feedback', (req, res)=>{
    let data = req.decoded;
    let bodyData = {
        type: req.body.type,
        content: req.body.content,
        student: data._id,
        blockName: data.roomId.blockName._id
    };
    if (bodyData.type && bodyData.content){
        //remove below data for production
        validRes.data = bodyData;
        res.json(validRes);
        Feedback.create(bodyData);
    }else{
        response.data = "invalid request";
        res.status(400).json(response);
    }
});

//taking complains regarding hostel
router.post('/report/complain', (req, res)=>{
    let data = req.decoded;
    let bodyData = {
        type: req.body.type,
        content: req.body.content,
        student: data._id,
        blockName: data.roomId.blockName._id,
        roomNum: data.roomId
    };
    if (bodyData.type && bodyData.content){
        //remove below data for production
        validRes.data = bodyData;
        res.json(validRes);
        Complain.create(bodyData);
    }else{
        response.data = "invalid request";
        res.status(400).json(response);
    }
});

//student logout route
router.get("/logout", (req, res)=>{
    res.json(validRes);
    Student.findByIdAndUpdate(req.decoded._id, {$set:{"session": null}}, (err)=>{
        if (err) throw err;
    });
});

module.exports = router;