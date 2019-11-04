let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let block = new mongoose.Schema({
    blockId : {type: String, default: 'BQ', unique: true},
    //alternative value is girls
    type: {type: String, default: 'boys', required: true},
    block: {type: String, default: 'Q', required: true},
    name: {type: String, default: "UNKNOWN", required: true}
});


module.exports = mongoose.model('blocks', block);