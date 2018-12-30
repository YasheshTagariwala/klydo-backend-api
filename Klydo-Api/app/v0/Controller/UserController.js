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
		.save(newUserData ,{patch : true})
	);			

	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {
		res.status(OK_CODE).json({auth: true, msg : "Password Changed Successfully"});
	}
}

module.exports = {
	'getUserDetail': getUserDetail,	
	'changeProfilePrivacy' : changeProfilePrivacy,
	'changePassword' : changePassword
}
