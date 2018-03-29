let UserExtra = require('../Models/UserExtra');
let UserProfile = require('../Models/UserProfile');
let authenticate = require('../../security/authenticate');
let catchError = require('../../Config/ErrorHandling');

let getAllUsers = async function (req, res) {
	let [users,err] = await catchError(UserExtra.with('userProfile').get());
	if(err){
		console.log(err);
	}else{
		res.json(users);
	}	
};

let getLoginVerify = async function (req,res){
	let [users,err] = await catchError(UserProfile.select(['user_email','user_password']).get());
	if(err){
		console.log(err);
	}else{
		res.json(users);
	}	
}

let validateMe = async function(req,res) {
	let [verification,err] = await catchError(authenticate.validateToken(req.body.token));
	if(err){
		console.log(err);
	}else{
		res.send(verification);
	}	
}

module.exports = {
	'getAllUsers': getAllUsers,
	'getLoginVerify': getLoginVerify,
	'validateMe': validateMe
}
