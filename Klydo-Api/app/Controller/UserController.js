const UserExtra = require('../Models/UserExtra');
const UserProfile = require('../Models/UserProfile');


var getAllUsers = function (req, res) {	
	new UserExtra().with('userProfile').get()
		.then(function(users){
			res.json(users);
		}).catch(function(error){
			console.log(error);
		});				
};

var getLoginVerify = function (req,res){
	new UserProfile().select(['user_email','user_password']).get()
		.then(function(users){
			res.json(users);
		}).catch(function(error){
			console.log(error);
		});	
}


module.exports = {
	'getAllUsers':getAllUsers,
	'getLoginVerify':getLoginVerify
}