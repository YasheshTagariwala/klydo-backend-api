let UserProfile = require('../Models/UserProfile');
let authenticate = require('../../security/authenticate');
let catchError = require('../../Config/ErrorHandling');

let loginCheck = async (req, res) => {
	let uname = req.body.uname;
	let password = req.body.password;
	let [users,err] = await catchError(UserProfile.select(['user_email','first_name','last_name']).
										where({'username': uname, 'user_password': password}).get());
	if(err) {
		console.log('err');
		res.json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
	} else {
		if(users.length == '') {
			res.json({auth: false, msg: 'No user found.'});
		} else {
			let [jwt_token,err] = await catchError(authenticate.createToken(users.uname));
			if(err) {
				console.log(err);
				res.json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
			} else {
				res.status(200).json({auth: true, msg: 'Save your token.', token: jwt_token});
			}
		}
	}
}


module.exports = {
	'loginCheck': loginCheck
}
