let UserExtra = require('../Models/UserExtra');
let UserProfile = require('../Models/UserProfile');
let authenticate = require('../../security/authenticate');
let catchError = require('../../Config/ErrorHandling');

//Get User details
let getUsersDetails = async  (req, res) => {
	let [users,err] = await catchError(UserExtra.with('userProfile').where({'id': req.body.user_id}).get());
	if(err){
		console.log(err);
		res.status(404).json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
	}else{
		res.status(200).json({auth: true, msg:'Success', data: users});
	}

};

module.exports = {
	'getUsersDetails': getUsersDetails,
}
