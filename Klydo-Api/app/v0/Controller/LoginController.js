let UserProfile = require(APP_MODEL_PATH + 'UserProfile');
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

TODO:'signupUser Api remians'

//sign up users
let signupUser = async (req, res) => {
	let requestData = req.body;
	if(validations.objectEmpty(requestData)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}

}


module.exports = {
	'loginCheck': loginCheck
}
