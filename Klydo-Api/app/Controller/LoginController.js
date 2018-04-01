let UserProfile = require('../Models/UserProfile');
let authenticate = require('../../security/authenticate');
let catchError = require('../../Config/ErrorHandling');
let validations = require('../Utility/Validations');
let statusCode = require('../Utility/HTTPStatusCodes');

//login users
let loginCheck = async (req, res) => {
	let uname = req.body.uname;
	let password = req.body.password;

	if(validations.empty(uname)) {
		res.status(statusCode.UNAUTHORIZED_CODE).json({auth: false, msg:statusCode.UNAUTHORIZED_MESSAGE});
		return;
	}
	if(validations.empty(password)) {
		res.status(statusCode.OK_CODE).json({auth: false, msg:statusCode.OK_MESSAGE});
		return;
	}

	let [users,err] = await catchError(UserProfile.select(['user_email','first_name','last_name']).
										where({'username': uname, 'user_password': password}).get());
	if(err) {
		console.log('err');
		res.status(statusCode.INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:statusCode.INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {
		if(validations.objectEmpty(users)) {
			res.status(statusCode.NOT_FOUND_CODE).json({auth: false, msg: statusCode.NOT_FOUND_MESSAGE});
			return;
		} else {
			let [jwt_token,err] = await catchError(authenticate.createToken(users.uname));
			if(err) {
				console.log(err);
				res.status(statusCode.UNAUTHORIZED_CODE).json({auth: false, msg:statusCode.UNAUTHORIZED_MESSAGE});
				return;
			} else {
				res.status(statusCode.OK_CODE).json({auth: true, msg: 'Save your token.', token: jwt_token});				
			}
		}
	}
}

TODO:'signupUser Api remians'

//sign up users
let signupUser = async (req, res) => {
	let requestData = req.body;
	if(validations.objectEmpty(requestData)) {
		res.status(statusCode.NOT_FOUND_CODE).json({auth: false, msg:statusCode.NOT_FOUND_MESSAGE});
		return;
	}

}


module.exports = {
	'loginCheck': loginCheck
}
