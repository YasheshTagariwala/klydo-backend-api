//login users
let loginCheck = async (req, res) => {	
	let UserProfile = loadModal('UserProfile');
	let authenticate = loadSecurity('authenticate');
	let validations = loadUtility('Validations');
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

	let [users,err] = await catchError(UserProfile.withSelect('userExtra',['profile_image']).select(['id']).
										where({'username': uname, 'user_password': password})
										.orWhere({'user_email' : uname ,'user_password' : password}).first());
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
				res.status(OK_CODE).json({auth: true, msg: 'Save your token.', token: jwt_token ,data : users});				
			}
		}
	}
}

//forget password api
let forgetPassword = async (req, res) => {	
	let validations = loadUtility('Validations');
	let UserProfile = loadModal('UserProfile');
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

	let [users,err] = await catchError(UserProfile.where({'username': uname})
						.orWhere({'user_email' : uname}).first());
	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {		
		if(validations.objectEmpty(users)) {
			res.status(NOT_FOUND_CODE).json({auth: false, msg: NOT_FOUND_MESSAGE});
			return;
		} else {			
			let newUserData = {
				user_password : password
			}			

			let [data ,err] = await catchError(UserProfile.where({'username': uname})
				.orWhere({'user_email' : uname})
				.save(newUserData ,{patch : true})
			);

			var mailOptions = {
				from: 'klydo.space@gmail.com',
				to: 'fakelaptop1234@gmail.com',
				subject: 'Sending Email using Node.js',
				text: 'That was easy!'
			  };

			getMailTrasporter().sendMail(mailOptions,(error,info) => {
				if (error) {
					console.log(error);
				  } else {
					console.log('Email sent: ' + info.response);
				  }
				getMailTrasporter().close();
			})

			if(err) {
				console.log(err);
				res.status(UNAUTHORIZED_CODE).json({auth: false, msg:UNAUTHORIZED_MESSAGE});
				return;
			} else {
				res.status(OK_CODE).json({auth: true});
			}
		}
	}
}

//sign up users
let signupUser = async (req, res) => {
	let UserExtra = loadModal('UserExtra');
	let validations = loadUtility('Validations');
	let UserProfile = loadModal('UserProfile');
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
	'signupUser' : signupUser,
	'forgetPassword' : forgetPassword
}
