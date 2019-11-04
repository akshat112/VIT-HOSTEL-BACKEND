let express = require('express');
let router = express.Router();
let Student = require('../models/student');
let Rooms = require('../models/room');
let Request = require('../models/clean_req');
let Feedback = require('../models/feedback');
let Complain = require('../models/complains');
let Guard = require('../models/guard');
let { validRes } = require("../config");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

//starting server if not running
router.get('/test', (req, res)=>{
  res.json(validRes);
});


//clear database
router.get('/clear/database/unknown', (req, res)=>{
  res.json(validRes);
  Request.deleteMany({}, (err)=>{
    if (err) throw err;
    console.log("Clean req Data deleted");
  });
  Student.remove({}, (err)=>{
    if (err) throw err;
    console.log("Data deleted");
  });
  Guard.remove({}, (err)=>{
    if (err) throw err;
    console.log("Data deleted");
  });
  Complain.remove({status:true}, (err)=>{
    if (err) throw err;
    console.log("Data deleted");
  });
  console.log("All data deleted");
});

module.exports = router;
