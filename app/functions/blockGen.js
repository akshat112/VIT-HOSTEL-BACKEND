require('dotenv/config');
let mongoose = require('mongoose');
let Block = require('../models/block');

let dbUrl = process.env.TESTDB_URL;

//dbUrl = process.env.MONGODB_URL;

mongoose.connect(dbUrl, {useNewUrlParser: true, useFindAndModify: false}, err => {
    if (err) console.error.bind(console, 'connection error: ');
    console.log('Connected to DataBase');
    let arr = '', bb="";

    for(let i=65;i<91;i++){
        bb = String.fromCharCode(i);
        arr = "B" + bb;
        Block.create({blockId: arr, block: bb});
        console.log(arr);
    }
});

//let Block = require('../models/block');

/*let arr = '', bb="";

for(let i=65;i<91;i++){
    bb = String.fromCharCode(i);
    arr = "B" + bb;
    Block.create({blockId: arr, block: bb});
    console.log(arr);
}*/