require('dotenv/config');
let express = require('express');
let path = require('path');
let favicon = require('static-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let cors = require("cors");

//installed
let helmet = require('helmet');
let compression = require('compression');
let mongoose = require('mongoose');
let session = require('express-session');
let sanitizer = require('express-auto-sanitize');
let DDOS = require("ddos");
let ddos = new DDOS({burst: 100, limit: 200});

const options = {
    query: Boolean,
    body: Boolean,
    cookies: Boolean,
    original: Boolean, // will keep the original version in req.original
    //sanitizerFunction: Function // use your personnal sanitizing algorithm
};

let index = require('./app/routes/index');
let student = require('./app/routes/student');
let guard = require('./app/routes/guard');
let StudentPage = require('./app/routes/stud-page');
let GuardPage = require('./app/routes/guard-page');

let app = express();

let dbUrl = (process.env.NODE_ENV === 'PRODUCTION') ? process.env.MONGODB_URL : process.env.TESTDB_URL;
    
//database connection
mongoose.connect(dbUrl, {useNewUrlParser: true, useFindAndModify: false}, err => {
    if (err) console.error.bind(console, 'connection error: ');
    console.log('Connected to DataBase');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.disable('etag');
app.disable('x-powered-by');
app.set('trust proxy', 1);

//app.use(ddos.express);

var whitelist = ['http://localhost:4200', 'http://localhost:8080', 'https://vithostelservices.herokuapp.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
//     origin: '*'
  },
  credentials: true
};
// app.use(cors(corsOptions));
app.use(cors());
// app.use(cors({credentials: true, origin: 'http://localhost:4200'}));
app.use(sanitizer(options));
app.use(helmet());
app.use(compression());
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev')); //'combined' outputs the Apache style LOGs
/*app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //secure: true,
        httpOnly: false,
        //sameSite: true,
        maxAge : 1000*60*60*24*300,
    }
}));*/

app.use('/', index);
app.use('/guard', guard);
app.use('/students', student);
app.use('/page/guards/', GuardPage);
app.use('/page/students/', StudentPage);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'DEV') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);//.render('error-500');
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log("Server started");
module.exports = app;
