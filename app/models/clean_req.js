let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let cleanReq = new mongoose.Schema({
    uid: {type: String, default: null },
    //blockId
    blockName: {type: Schema.Types.ObjectId, ref:'blocks', default: null},
    //this will conatiner rooom details
    roomNum: {type: Schema.Types.ObjectId, ref:'rooms'},
    //request generation time
    time: {type: Date, default: Date.now},
    //request by
    requestBy: {type: Schema.Types.ObjectId, ref: 'students'},
    //token generated for each request for room clean done confirmation
    token: {type: String, default:  null, unique: true},
    /*
    * if status value is false then room is not cleaned
    * else room cleaned
    * */
    status: {type: Boolean, default: false},
    /*
    * time guard will be confirm for room clean
    * */
    done: {type: Date, default: null},
    /*
    * cleaner name who done cleaning
    * */
    doneBy: {type: String, default: null},
    //yes if student give bribe to worker
    bribe: {type: Boolean, default: false},
    /*
    * time when some body is available on room
    * */
    //available: {type: String, default: null}
});

module.exports = mongoose.model('cleans', cleanReq);