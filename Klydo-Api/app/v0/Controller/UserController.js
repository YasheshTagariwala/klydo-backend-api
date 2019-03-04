let UserProfile = loadModal('UserProfile');
let UserExtra = loadModal('UserExtra');
let Reaction = loadModal('PostReaction');
let KlyspaceData = loadModal('KlyspaceData');
let bookshelf = loadConfig('Bookshelf.js');
let fs = require('fs');
let Graph = loadController('GraphController');

//Get single User details
let getUserDetail = async  (req, res) => {
    var [users,err] = await catchError(UserProfile.select(['id','first_name','middle_name'
        ,'last_name','dob','city','gender','user_email','username','mobile_number','about_me'])
        .withSelect('userExtra',['id','report_count','is_reported','profile_privacy',
            'profile_image','is_verified','is_paid','interest','emotion','avg_emotions',
            'avg_interests','hobbies'])
        .withSelect('posts',['emotion','profile_id','id','post_content','post_hashes','post_title','post_media','created_at','post_published'], (q) => {
            q.with({'userProfile' : (q) => {
                    q.select(['first_name','last_name']);
                    q.withSelect('userExtra',['profile_image']);
                }});
            q.where({'profile_id':req.params.id});
            q.orderBy('id','desc');
            q.offset(0);
            q.limit(RECORED_PER_PAGE);
            if(req.params.friend_id) {
                q.withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
                    q.where('profile_id', req.params.friend_id);
                })
            }
            q.with({'comments' : (q1) => {
                    q1.select(['comment_content','created_at','profile_id','id']);
                    q1.withSelect('userProfile', ['first_name','last_name','id'] , (q2) => {
                        q2.withSelect('userExtra',['profile_image']);
                    });
                    q1.offset(0);
                    q1.orderBy('id','desc');
                    q1.limit(5)
                }})
        })
        .with('userFollowings' , (q) => {
            if(req.params.friend_id){
                q.select(['id','followers','accepted']);
                q.where('followers',req.params.friend_id);
            }
        })
        .where({'id': req.params.id}).first());
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
                // q.offset(0);
                // q.limit(2);
            })
            .get());
        if(err1){
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        }else {
            users = users.toJSON();
            users.reaction = reaction;
            users.klyspaceData = null;
            if(req.params.friend_id) {
                let [klyspaceData,err1] = await catchError(KlyspaceData.select(['id','klyspace_id','doer_profile_id','doee_profile_id','data'])
                    .where('doer_profile_id',req.params.friend_id)
                    .get());
                users.klyspaceData = klyspaceData;
            }else {
                let [klyspaceData,err1] = await catchError(KlyspaceData
                    .select(['klyspace_id',bookshelf.knex.raw('round(avg(data),0) as data')])
                    .where('doee_profile_id',req.params.id)
                    .query((q) => {
                        q.groupBy('klyspace_id');
                    })
                    .get());
                users.klyspaceData = klyspaceData;
            }
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
    let year = req.body.date_of_birth.split('-');
    await Graph.manipulateUser(req.body.user_profile_id,req.body.first_name,req.body.last_name,year[0]);

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
    res.status(OK_CODE).json({auth: true, msg : "Profile Picture Updated Successfully", data : filename});
};

let chosenOne = async (req, res)=> {
   let [users,err] = await catchError(UserProfile.select(['id','first_name','middle_name','last_name','dob','city','gender','user_email','username','mobile_number','about_me'])
                    .withSelect('userExtra',['id','report_count','is_reported','profile_privacy','profile_image','is_verified','is_paid','interest','emotion','avg_emotions','avg_interests','hobbies'])
                    .orderBy('id','desc').get());

   if(err) {
       console.log(err);
       res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE});
       return;
   }else {
       res.status(OK_CODE).json({auth: true, msg : "Users Found", data : users});
   }
};

module.exports = {
	'getUserDetail': getUserDetail,
	'changeProfilePrivacy' : changeProfilePrivacy,
	'changePassword' : changePassword,
	'updateProfile' : updateProfile,
	'changeStatus' : changeStatus,
	'updateProfileImage' : updateProfileImage,
    'chosenOne' : chosenOne
};
