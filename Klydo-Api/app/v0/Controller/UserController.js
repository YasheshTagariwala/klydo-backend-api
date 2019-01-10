let UserProfile = loadModal('UserProfile');
let UserExtra = loadModal('UserExtra');

//Get single User details
let getUserDetail = async  (req, res) => {
	let [users,err] = await catchError(UserProfile.with('userExtra').where({'id': req.params.id}).get());
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		res.status(OK_CODE).json({auth: true, msg:'Success', data: users});
	}
};

//Change Profile Privacy
let changeProfilePrivacy = async (req, res) => {
	let newProfilePrivacy = {
		profile_privacy : req.body.profile_privacy
	}	

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

module.exports = {
	'getUserDetail': getUserDetail,	
	'changeProfilePrivacy' : changeProfilePrivacy,
	'changePassword' : changePassword,
	'updateProfile' : updateProfile
}
