let UserExtra = require('../Models/UserExtra');
let UserProfile = require('../Models/UserProfile');
let authenticate = require('../../security/authenticate');


let getAllUsers = async function (req, res) {
	let users = await UserExtra.with('userProfile').get();
	res.json(users);			
};

let getLoginVerify = async function (req,res){
	let users = await UserProfile.select(['user_email','user_password']).get();
	res.json(users);		
}

let loginCheck = async function(req, res) {
	let uname = req.body.uname;
	let password = req.body.password;
	let users = await UserProfile.select(['user_email','first_name','last_name']).where({'username': uname, 'user_password': password}).get();		
	if(users.length == '') {
		res.json({auth: false, msg: 'Authentication failed.'});
	} else {
		let jwt_token = await authenticate.createToken(users.uname);
		res.status(200).json({auth: true, msg: 'Save your token.', token: jwt_token});
	}
}

let validateMe = async function(req,res) {
	let verification = await authenticate.validateToken(req.body.token);	
	if(verification.auth){
		res.json('Valid');
	}else{
		res.json('Fuck Off You AssHole');
	}
}

module.exports = {
	'getAllUsers':getAllUsers,
	'getLoginVerify':getLoginVerify,
	'loginCheck' :loginCheck,
	'validateMe' : validateMe
}
