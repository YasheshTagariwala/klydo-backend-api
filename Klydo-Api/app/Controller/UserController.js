let UserExtra = require('../Models/UserExtra');
let UserProfile = require('../Models/UserProfile');
let authenticate = require('../../security/authenticate');
let catchError = require('../../Config/ErrorHandling');

let getAllUsers = async  (req, res) => {
	let [users,err] = await catchError(UserExtra.with('userProfile').get());
	if(err){
		console.log(err);
	}else{
		res.json(users);
	}	
};

let getLoginVerify = async  (req, res) => {
	let [users,err] = await catchError(UserProfile.select(['user_email','user_password']).get());
	if(err){
		console.log(err);
	}else{
		res.json(users);
	}	
}

let validateMe = async (req, res) => {
	let [data,err] = await catchError(UserProfile.select(['id']).get());	
	if(err)
		console.log(err);
	else 
		res.json(data);
}

// let validateMe = (req, res) => {
// 	UserProfile.forge({'id',3104}).destroy().then((data) => {
// 		res.json(data);
// 	}).catch((err) => {
// 		console.log(err);
// 	})
// }

module.exports = {
	'getAllUsers': getAllUsers,
	'getLoginVerify': getLoginVerify,
	'validateMe': validateMe
}
