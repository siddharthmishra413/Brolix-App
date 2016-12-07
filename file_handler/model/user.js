var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userschema = new Schema({

	
	userName: {
		type: String
	},

	userId : {
		type: String
	}, 

	deviceToken : {
		type : String,
		default : null
	},
	socketId: {
		type: String
	}
});

var Users = mongoose.model('Users', userschema);

module.exports = Users;
