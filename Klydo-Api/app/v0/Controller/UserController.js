let UserProfile = loadModal('UserProfile');
let UserExtra = loadModal('UserExtra');
let Reaction = loadModal('PostReaction');
let bookshelf = loadConfig('Bookshelf.js');
let fs = require('fs');
//Get single User details
let getUserDetail = async  (req, res) => {
    let [users,err] = await catchError(UserProfile.with('userExtra')
		.withSelect('klyspaceData', ['id','klyspace_id','doer_profile_id','doee_profile_id','data'] ,(q) => {
    	if(req.params.friend_id){
            q.where('doer_profile_id',req.params.friend_id);
		}
	}).withSelect('posts',['emotion','profile_id','id','post_content','post_hashes','post_title','post_media','created_at','post_published'], (q) => {
		q.where({'profile_id':req.params.id});
		q.orderBy('id','desc');
        q.offset(0);
        q.limit(RECORED_PER_PAGE);
	}).where({'id': req.params.id}).first());
    if(err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    }else{
        let [reaction,err1] = await catchError(Reaction.select(['reaction_id',bookshelf.knex.raw('count(*) as count')]).whereHas('posts', (q) => {
            q.where('profile_id',req.params.id);
        }).orderBy('count','desc')
		.query((q) => {
			q.groupBy('reaction_id');
			q.offset(0);
			q.limit(2);
		})
        .get());
        if(err1){
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        }else {
            users = users.toJSON();
            users.reaction = reaction;
        }
        res.status(OK_CODE).json({auth: true, msg:'Success', data: users});
    }
};

//Change Profile Privacy
let changeProfilePrivacy = async (req, res) => {
	let newProfilePrivacy = {
		profile_privacy : req.body.profile_privacy
	};

	let [data ,err] = await catchError(UserExtra.where({'user_profile_id': req.body.user_profile_id}).save(newProfilePrivacy ,{patch : true}));

	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {
		res.status(OK_CODE).json({auth: true, msg : "Profile Privacy Changed Successfully" , data : 1});
	}
}

//Change Password
let changePassword = async (req, res) => {
	let newUserData = {
		user_password : req.body.password
	}			

	let [data ,err] = await catchError(UserProfile.where({'id': req.body.user_profile_id})
		.where({'user_password' : req.body.old_password})		
		.save(newUserData ,{patch : true})
	);			

	if(err) {
		console.log(err);
		res.status(OK_CODE).json({auth: true, msg:'No User Found'});
		return;
	} else {
		res.status(OK_CODE).json({auth: true, msg : "Password Changed Successfully"});
	}
}

//Update User Profile
let updateProfile = async (req, res) => {
	let profile = {
		first_name : req.body.first_name,
		last_name : req.body.last_name,
		dob : req.body.date_of_birth,
		gender : req.body.gender,
		about_me : req.body.status
	}

	let [data,err] = await catchError(UserProfile.where({'id' : req.body.user_profile_id})
		.save(profile,{patch : true})
	);

	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else {
		res.status(OK_CODE).json({auth: true, msg : "Profile Updated Successfully"});
	}
}

//Change User Status
let changeStatus = async (req, res) => {
	if(req.body.status.length > 140){
		res.status(OK_CODE).json({auth: true, msg : "Status Too Long Only 140 Chars Allowed"});
	}else{
		let profile = {
			about_me : req.body.status
		}
	
		let [data,err] = await catchError(UserProfile.where({'id' : req.body.user_id})
			.save(profile,{patch : true})
		);
	
		if(err){
			console.log(err);
			res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
			return;
		}else {
			res.status(OK_CODE).json({auth: true, msg : "Status Updated Successfully"});
		}
	}	
}

let updateProfileImage = async (req, res) => {
	// let [user,err] = await catchError(UserExtra.where('user_profile_id',req.body.user_id).first());
	// if(err){
    //     console.log(err);
    //     res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
    //     return;
	// }
	//
	// user = user.toJSON();
	// if(user.profile_image != null){
	// 	fs.unlink(MediaPath + '/' + user.profile_image, (e) => {
	// 		if(e) throw e;
	// 	});
	// }
    let moment = require('moment');
    let profile_image = req.files.profile_image;
    let filename = req.body.user_id + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + profile_image.name.substring(profile_image.name.lastIndexOf('.'));
    let [data,err1] = await catchError(profile_image.mv(MediaPath + '/' + filename));
    if(err1){
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    }

	let user_data = {
		profile_image : filename
	};

	let [update_data,err2] = await catchError(UserExtra.
	where('user_profile_id',req.body.user_id).
	save(user_data,{patch : true}));
    if(err2){
        console.log(err2);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE});
        return;
	}
    res.status(OK_CODE).json({auth: true, msg : "Profile Picture Updated Successfully"});
};

module.exports = {
	'getUserDetail': getUserDetail,	
	'changeProfilePrivacy' : changeProfilePrivacy,
	'changePassword' : changePassword,
	'updateProfile' : updateProfile,
	'changeStatus' : changeStatus,
	'updateProfileImage' : updateProfileImage
};
