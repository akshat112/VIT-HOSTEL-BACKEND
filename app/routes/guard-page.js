let express = require('express');
let router = express.Router();
let { guard } = require("../functions");

router.get('/auth', (req, res)=>{
	res.render("guard-auth");//res.render('guard-auth', {msg: undefined, color: null});
});

router.use(guard);

router.get('/dashboard', (req, res)=>{
	res.json(req.msg);
});

module.exports = router;