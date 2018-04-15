let UserProfile = require('../Models/UserProfile');
let FeelPals = require('../Models/Feelpals');
let Activity = require('./ActivityController');
let catchError = require('../../../Config/ErrorHandling');
let statusCode = require('../Utility/HTTPStatusCodes');


let addFriend = async (req , res) => {
    let [activityId,err] = await catchError(Activity.createActivity(2));	
	if(activityId == null || err){
		console.log(err);
		res.status(statuscode.INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE})
		return;
    }
    
    let newFriend = {
        followings : req.body.friend_id,
        followers : req.body.user_id,        
		activity_id : activityId
	}			
	
	let [data,err1] = await catchError(FeelPals.forge(newFriend).save());	
	if(err1){
		console.log(err1);
		res.status(statuscode.INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
		res.status(statusCode.OK_CODE).json({auth : true, msg : "Friend Added"})
	}
}


module.exports = {
    'addFriend' : addFriend
}