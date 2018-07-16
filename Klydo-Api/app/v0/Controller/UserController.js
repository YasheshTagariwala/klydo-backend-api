let UserProfile = require(APP_MODEL_PATH + 'UserProfile');

//Get single User details
let getUserDetail = async  (req, res) => {
	let [users,err] = await catchError(UserProfile.with('userExtra').where({'id': req.params.id}).get());
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		res.status(OK_CODE).json({auth: true, msg:'Success', data: users});
	}
};

module.exports = {
	'getUserDetail': getUserDetail,	
}
