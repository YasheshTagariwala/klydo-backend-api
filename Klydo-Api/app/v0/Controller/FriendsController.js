let UserProfile = require(APP_MODEL_PATH + 'UserProfile');
let FeelPals = require(APP_MODEL_PATH + 'Feelpals');
let Activity = require(APP_CONTROLLER_PATH + 'ActivityController');
let Validation = require(APP_UTILITY_PATH + 'Validations');
const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');
let _ = require('underscore');

let addFriend = async (req , res) => {
    let [activityId,err] = await catchError(Activity.createActivity(2));	
	if(activityId == null || err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
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
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
		res.status(OK_CODE).json({auth : true, msg : "Friend Added"})
	}
}

let acceptFriend = async (req, res) => {
	let fid = req.params.id;	
	if(Validation.empty(fid)){
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_CODE});
		return;
	}

	let fellPalsData = {
		accepted : true
	};

	let [data ,err] = await catchError(FeelPals
		.where({id : fid})
		.save(fellPalsData ,{patch : true})
	);

	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	} else {
		res.status(OK_CODE).json({auth : true,msg : "Friend Request Accepted"})
	}
}

let rejectFriend = async (req , res) => {
	let fid = req.params.id;	
	if(Validation.empty(fid)){
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_CODE});
		return;
	}

	let [data ,err] = await catchError(FeelPals
		.forge({id : fid})
		.destroy()
	);

	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	} else {
		res.status(OK_CODE).json({auth : true,msg : "Friend Request Rejected"})
	}
}

let getFollowers = async (req , res) => {
	let [friendData ,err] = await catchError(FeelPals				
		.withSelect('userProfileFollower',[bookshelf.knex.raw(['trim(first_name) as fname','trim(last_name) as lname'])], (q) => {
			q.withSelect('userExtra',[bookshelf.knex.raw(['trim(profile_image) as dp','trim(emotion) as emotion'])])
		})
		.where({'followings' : req.params.id , 'accepted' : true , 'blocked' : false})
		.orderBy('id','desc')
		.get());
		
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(friendData)){
			let finalData = _.map(friendData.toJSON() , (data) => {
				return {
					'name' : data.userProfileFollower.fname,
					'lname' : data.userProfileFollower.lname,
					'uid' : data.userProfileFollower.id,
					'fid' : data.id,
					'dp' : data.userProfileFollower.userExtra.dp,
					'emotion' : data.userProfileFollower.userExtra.emotion
				}
			});	
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : finalData});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}
	}	
}

let getFollowings = async (req , res) => {
	let [friendData ,err] = await catchError(FeelPals				
		.withSelect('userProfileFollowing',[bookshelf.knex.raw(['trim(first_name) as fname','trim(last_name) as lname'])], (q) => {
			q.withSelect('userExtra',[bookshelf.knex.raw(['trim(profile_image) as dp','trim(emotion) as emotion'])])
		})
		.where({'followers' : req.params.id , 'accepted' : true , 'blocked' : false})
		.orderBy('id','desc')
		.get());
		
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(friendData)){
			let finalData = _.map(friendData.toJSON() , (data) => {
				return {
					'name' : data.userProfileFollowing.fname,
					'lname' : data.userProfileFollowing.lname,
					'uid' : data.userProfileFollowing.id,
					'fid' : data.id,
					'dp' : data.userProfileFollowing.userExtra.dp,
					'emotion' : data.userProfileFollowing.userExtra.emotion
				}
			});	
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : finalData});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}
	}	
}

module.exports = {
	'addFriend' : addFriend,
	'acceptFriend' : acceptFriend,
	'rejectFriend' : rejectFriend,
	'getFollowers' : getFollowers,
	'getFollowings' : getFollowings
}