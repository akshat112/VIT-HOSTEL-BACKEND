let express = require('express');
let router = express.Router();
let { student } = require('../functions');

router.get('/auth', function(req, res) {
	res.render("stud-auth");//res.render('student-auth', {msg: undefined, color: null});
});

router.use(student);

router.get('/dashboard', (req, res)=>{
	console.log(req.msg);
	res.render('stud-desk');
});


module.exports = router;