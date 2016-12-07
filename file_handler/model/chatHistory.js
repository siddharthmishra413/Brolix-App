var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({

	
	senderId: {
		type: String
	},

	senderName :{
		type: String
	},
	
    receiverId: {
		type:String
	},
		
    receiverName: {
    	type: String
    },
    mediaType: {
    	type:String
    },
    media: {
    	type: String
    },
 	
	message:{
		type: String
	},

	timeStamp:{
		type: Number
	},

	lastmsgId:{
		type: Number
	},
    status: {
        type: String,
        default: 'SENT'
    }
});

var establishedModels = {};
function createModelForName(tablename) {
    if (!(tablename in establishedModels)) {
      
        establishedModels[tablename] = mongoose.model(tablename, chatSchema);
    }
    return establishedModels[tablename];
}

module.exports.createModelForName = createModelForName;



