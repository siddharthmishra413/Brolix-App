var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var savedFiles = new Schema({
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    }
});

var savedFiles = mongoose.model('savedFiles', savedFiles);
module.exports = savedFiles;
