let express = require('express');
let router = express.Router();
let Request = require('../models/clean_req');
let Feedback = require('../models/feedback');
let Complain = require('../models/complains');
let Block = require("../models/block");
let Guard = require('../models/guard');
let uuidv1 = require('uuid/v1');
let { guard } = require("../functions");
let { response, validRes, COOKIES_AGE } = require("../config");
let cookie = require('cookie');
//let jwt = require('jsonwebtoken');

//guard register and login
router.post('/', (req, res)=>{
	let body = req.body;

    body.block = (body.block.trim()).toUpperCase();
	body.name = (body.name.trim()).toUpperCase();
	body.type = (body.type.trim()).toLowerCase();
	
	let sessionValue = uuidv1();
	
	if (((body.block).length != 1) ||  !(body.name) || !(body.type)) 
        res.status(400).json(response);
	
	else{
		Block.findOne({block: body.block, type: body.type}, "blockId", (err, bData)=>{
			body.block = body.type = null;

			if (err) throw err;

			Guard.findOneAndUpdate(body, {$set:{'session': sessionValue}}, (err, data)=>{
				try {
					if (err) throw err;
					if (data != null){
						res.setHeader('Set-Cookie', cookie.serialize('token', String(sessionValue), {
							path: 'guard',
							maxAge: COOKIES_AGE
                        }));
                        validRes.data = data;
			validRes.data.session = sessionValue;			
                        res.json(validRes);
					}else{
						body.session = sessionValue;
						body.blockName = bData._id;
						Guard.create(body, (error, newData)=>{
							if (error) throw error;
							res.setHeader('Set-Cookie', cookie.serialize('token', String(sessionValue), {
								path: 'guard',
								maxAge: COOKIES_AGE
							}));
							validRes.data = newData;
							validRes.data.session = sessionValue;
							res.json(validRes);
						});
					}
				}catch(err){
					response.data = "Something happening wrong with database";
					res.json(response);
				}
			});
		});
    }
});

router.use(guard);

//list of pending request
router.get('/pending/request', (req,res)=>{
	const query = {
		status: false,
		blockName: req.decoded.blockName._id
	};
	Request.find(query).populate("roomNum requestBy").exec((err, data)=>{
		if (err) throw err;
		if (data.length > 0){
			//data.forEach(x => x._id = null);
			validRes.data = data;
			res.json(validRes);
		}else{
			validRes.data = "no request";
			res.json(validRes);
		}
	});
});

//list of room cleaning confirmation by guard
router.get('/request/confirmation/list', (req, res)=>{
	const query = {
		status: true,
		blockName : req.decoded.blockName._id,
		done : null
	};
	//console.log(query);
	Request.find(query).populate("roomNum requestBy").exec((err, data)=>{
		if (err) throw err;
		console.log('data', data);
		if (data.length > 0){
			//data.forEach(x => x._id = null);
			validRes.data = data;
			res.json(validRes);
		}else {
			validRes.data = "no request";
			res.json(validRes);
		}
	});
});

//room clean request confirmation by guard
router.post('/clean/request/confirmed/', (req, res)=>{
	const query = {
		status: true, 
 		blockName : req.decoded.blockName._id,
		token: req.body.token
	};
	const newData = {
		doneBy: req.body.worker,
		done: (Date.now())
	};
	console.log(newData);
	Request.findOneAndUpdate(query, {$set: newData}, (err, data)=>{
		if (err) throw err;
		console.log(data, (data ? validRes : response));
		validRes.data = data;
		response.data = "Not Confirmed from Student";
		res.json((data ? validRes : response));
	});
});

//list of complaints
router.get('/complain/list', (req, res)=>{
	const query = {
		status: false,
		blockName: req.decoded.blockName._id
	};
	Complain.find(query).populate("roomNum requestBy").exec((err, data)=>{
		//console.log(data);
		if (err) throw err;
		if (data.length > 0){
			//data.forEach(x => x._id = null);
			validRes.data = data;
			res.json(validRes);
		}else{
			response.data = "No complains";
			res.json(response)
		}
	});
});

//complains is resolved
router.get('/complains/complete', (req, res)=>{
	//console.log(req.query);
	const query = {
		status: false,
		uid: req.query.uid,
		blockName: req.decoded.blockName._id,
	};
	const updateQuery = {
		status: true,
		confirmedBy: req.decoded._id
	}
	Complain.findOneAndUpdate(query, {$set: updateQuery}, (err, data)=>{
		if (err) throw err;
		data ? ((validRes.data = data) && res.json(validRes)) : (res.json(response));
	});
});


//logout route
router.get('/logout', (req, res)=>{
	res.json(validRes);
	Guard.findByIdAndUpdate(req.decoded._id, {$set: {"session": null}}, (err)=>{
		if (err) throw err;
	});
});

module.exports = router;
