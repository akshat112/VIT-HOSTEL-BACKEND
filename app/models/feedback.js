let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uuidv4 = require('uuid/v4')();

let feedback = new mongoose.Schema({
    uid: {type: String, default: uuidv4},
    //blockId
    blockName: {type: Schema.Types.ObjectId, ref:'blocks', default: null},
    /*
    * alternative value for type are improvements or other
    * */
    type: {type: String, default: 'bug', required: true},
    content: {type: String, default: null},
    student: {type: Schema.Types.ObjectId, ref: 'students'},
    time: {type: Date, default: Date.now}
});

module.exports = mongoose.model('feedbacks', feedback);