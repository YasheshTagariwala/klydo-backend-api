let FeelPals = loadModal('Feelpals');
let Activity = loadController('ActivityController');
let Validation = loadUtility('Validations');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');

let addFriend = async (req , res) => {
    let [activityId,err] = await catchError(Activity.createActivity(2));	
	if(activityId == null || err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
    }
    
    let newFriend = {
        followings : req.body.user_id,
        followers : req.body.friend_id,
		activity_id : activityId
	};
	
	let [data,err1] = await catchError(FeelPals.forge(newFriend).save());	
	if(err1){
		console.log(err1);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
		res.status(OK_CODE).json({auth : true, msg : "Friend Added"})
	}
}

let getAllProfilePost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [profilePost,err] = await catchError(Post
        .select(['emotion','profile_id','id','post_content','post_hashes','post_media','created_at','post_published'])
        // .where({'profile_id':req.params.id,'post_published' : true})
        .where({'profile_id':req.params.id})
        .orderBy('id','desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get());

    if(err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    }else{
        if(!Validation.objectEmpty(profilePost)){
            res.status(OK_CODE).json({auth : true, msg : 'Success', data : profilePost});
        }else{
            res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});
        }
    }
};

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
	let [friendData ,err] = await catchError(FeelPals.select(['id','followers'])
		.withSelect('userProfileFollower',['first_name','last_name'],(q) => {
			q.withSelect('userExtra',['profile_image','emotion'])
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
			if(req.params.friend_id){
				let [profileData ,err] = await catchError(FeelPals.select(['followers'])
				.withSelect('userProfileFollower',['first_name','last_name'],(q) => {
					q.withSelect('userExtra',['profile_image','emotion'])
				})		
				.where({'followings' : req.params.friend_id , 'accepted' : true , 'blocked' : false})
				.orderBy('id','desc')
				.get());
				
				if(err){
					friendData = friendData.toJSON();
					for(let i = 0; i < friendData.length ; i++){
						friendData[i].is_mutual = false;
					}
				}else{				
					friendData = friendData.toJSON();
					profileData = profileData.toJSON();
					for(let i = 0; i < friendData.length ; i++){
						for(let j = 0; j < profileData.length ; j++){
							if(friendData[i].followers == profileData[j].followers){							
								friendData[i].is_mutual = true;
								break;
							}else{							
								friendData[i].is_mutual = false;
							}
						}
					}
				}
			}
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : friendData});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}
	}	
}

let getFollowings = async (req , res) => {
	let [friendData ,err] = await catchError(FeelPals.select(['id','followings'])
		.withSelect('userProfileFollowing',['first_name','last_name'],(q) => {
			q.withSelect('userExtra',['profile_image','emotion'])
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
			if(req.params.friend_id){
				let [profileData ,err] = await catchError(FeelPals.select(['followings'])
				.withSelect('userProfileFollowing',['first_name','last_name'],(q) => {
					q.withSelect('userExtra',['profile_image','emotion'])
				})
				.where({'followers' : req.params.friend_id , 'accepted' : true , 'blocked' : false})
				.orderBy('id','desc')
				.get());	

				if(err){
					friendData = friendData.toJSON();
					for(let i = 0; i < friendData.length ; i++){
						friendData[i].is_mutual = false;
					}
				}else{				
					friendData = friendData.toJSON();
					profileData = profileData.toJSON();
					for(let i = 0; i < friendData.length ; i++){
						for(let j = 0; j < profileData.length ; j++){
							if(friendData[i].followings == profileData[j].followings){							
								friendData[i].is_mutual = true;
								break;
							}else{							
								friendData[i].is_mutual = false;
							}
						}
					}
				}
			}			
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : friendData});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}
	}	
}

//Get single Friend details
let getFriendDetail = async  (req, res) => {
	let [users,err] = await catchError(UserProfile.with('userExtra')
		.with('userFollowers', (q) => {
			q.where({ 'followings' : req.params.user_id});
		}).where({'id': req.params.id}).first());
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		res.status(OK_CODE).json({auth: true, msg:'Success', data: users});
	}
};

module.exports = {
	'addFriend' : addFriend,
	'acceptFriend' : acceptFriend,
	'rejectFriend' : rejectFriend,
	'getFollowers' : getFollowers,
	'getFollowings' : getFollowings,
	'getFriendDetail' : getFriendDetail,
    'getAllProfilePost' : getAllProfilePost
}