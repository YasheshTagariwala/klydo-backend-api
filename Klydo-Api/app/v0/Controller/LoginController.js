let UserProfile = require(APP_MODEL_PATH + 'UserProfile');
let UserExtra = require(APP_MODEL_PATH + 'UserExtra');
let authenticate = require(APP_SECURITY_PATH + 'Authenticate');
let validations = require(APP_UTILITY_PATH + 'Validations');

//login users
let loginCheck = async (req, res) => {
	let uname = req.body.uname;
	let password = req.body.password;

	if(validations.empty(uname)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}
	if(validations.empty(password)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}

	let [users,err] = await catchError(UserProfile.select(['user_email','first_name','last_name']).
										where({'username': uname, 'user_password': password}).get());
	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {
		if(validations.objectEmpty(users)) {
			res.status(NOT_FOUND_CODE).json({auth: false, msg: NOT_FOUND_MESSAGE});
			return;
		} else {
			let [jwt_token,err] = await catchError(authenticate.createToken(users.uname));
			if(err) {
				console.log(err);
				res.status(UNAUTHORIZED_CODE).json({auth: false, msg:UNAUTHORIZED_MESSAGE});
				return;
			} else {
				res.status(OK_CODE).json({auth: true, msg: 'Save your token.', token: jwt_token});				
			}
		}
	}
}

//sign up users
let signupUser = async (req, res) => {
	let requestData = req.body;
	if(validations.objectEmpty(requestData)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}

	let userData = {
		first_name : requestData.fname,
		middle_name : requestData.mname,
		last_name : requestData.lname,
		dob : requestData.birth_date,
		city : requestData.city,
		gender : requestData.sex,
		user_email : requestData.mail,
		username : (requestData.uname == '') ? requestData.mail : requestData.uname,
		user_password : requestData.pass,		
		mobile_number : requestData.number,
		about_me : requestData.about	
	}

	let [data , err] = await catchError(UserProfile.forge(userData).save());

	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
		let userExtra = {
			user_profile_id : data.id,
			profile_image : requestData.dp in requestData ? requestData.dp : null
		}

		let [data1 , err1] = await catchError(UserExtra.forge(userExtra).save());

		if(err1) {
			console.log(err1);
			res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
			return;
		}else{
			res.status(OK_CODE).json({auth : true,msg : "Sign Up Success"});
		}
	}	
}


module.exports = {
	'loginCheck': loginCheck,
	'signupUser' : signupUser
}
