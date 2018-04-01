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
		res.status(200).json({auth: false, msg:'Invalid Credantials.'});
		return;
	}

	let [users,err] = await catchError(UserProfile.select(['user_email','first_name','last_name']).
										where({'username': uname, 'user_password': password}).get());
	if(err) {
		console.log('err');
		res.status(404).json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
		return;
	} else {
		if(validations.objectEmpty(users)) {
			res.json({auth: false, msg: 'No user found.'});
			return;
		} else {
			let [jwt_token,err] = await catchError(authenticate.createToken(users.uname));
			if(err) {
				console.log(err);
				res.status(validations.UNAUTHORIZED_CODE).json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
				return;
			} else {
				res.status(200).json({auth: true, msg: 'Save your token.', token: jwt_token});
				return;
			}
		}
	}
}

//sign up users
let signupUser = async (req, res) => {
	let requestData = req.body;
	if(validations.objectEmpty(requestData)) {
		res.status(200).json({auth: false, msg:'Invalid Credantials.'});
	}

}


module.exports = {
	'loginCheck': loginCheck
}
