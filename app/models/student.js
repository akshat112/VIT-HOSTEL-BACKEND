let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uuidv4 = require('uuid/v4')();

let room = new mongoose.Schema({
    uid: {type: String, default: uuidv4, unique: true},
    //name of student
    name: {type: String, default: null},
    //registration number of student
    registerNumber: {type: String, default: null, unique: true},
    //store cookies
    session: {type: String, default: null},
    //student register time
    time: {type: Date, default: Date.now, required: true},
    //room details
    roomId: {type: Schema.Types.ObjectId, ref:"rooms", default: null}
});

module.exports = mongoose.model('students', room);