let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uuidv4 = require('uuid/v4')();

let complain = new mongoose.Schema({
    uid: {type: String, default: uuidv4},
    //blockId
    blockName: {type: Schema.Types.ObjectId, ref:'blocks', default: null},
    /*
    * alternative value for type are mess or other
    * */
    type: {type: String, default: 'room', required: true},
    content: {type: String, default: null},
    roomNum: {type: Schema.Types.ObjectId, ref:'rooms'},
    student: {type: Schema.Types.ObjectId, ref: 'students'},
    time: {type: Date, default: Date.now},
    //object id of guard which confirmed that complain is resolved
    confirmedBy: {type: Schema.Types.ObjectId, ref:'guards', default: null},
    /*
    * resolve status
    * false -> not resolved
    * */
    status: {type: Boolean, default: false}
});

module.exports = mongoose.model('complains', complain);