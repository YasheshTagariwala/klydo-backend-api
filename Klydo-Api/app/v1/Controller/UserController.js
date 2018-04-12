let UserProfile = require('../Models/UserProfile');
let catchError = require('../../../Config/ErrorHandling');
let statusCode = require('../Utility/HTTPStatusCodes');

//Get single User details
let getUserDetail = async  (req, res) => {
	let [users,err] = await catchError(UserProfile.with('userExtra').where({'id': req.params.id}).get());
	if(err){
		console.log(err);
		res.status(statusCode.INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:statusCode.INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		res.status(statusCode.OK_CODE).json({auth: true, msg:'Success', data: users});
	}
};

module.exports = {
	'getUserDetail': getUserDetail,
}
