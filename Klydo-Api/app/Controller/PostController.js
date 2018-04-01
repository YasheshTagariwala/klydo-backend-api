let Post = require('../Models/Posts');
let catchError = require('../../Config/ErrorHandling');
let statusCode = require('../Utility/HTTPStatusCodes');

let getAllUserPost = async (req, res) => {
	let [singlePost,err] = await catchError(Post.with('userProfile').where('profile_id',req.body.user_id).get());
	if(err){
		console.log(err);
		res.status(statusCode.INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		res.status(statusCode.OK_CODE).json({auth : true, msg : 'Success', data : singlePost});		
	}	
};

let getSinglePostWithComments = async (req ,res) => {
	let [postWithComment,err] = await catchError(Post.with('comments').where('id',req.body.post_id).get());
	if(err){
		console.log(err);
		res.status(statusCode.INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		res.status(statusCode.OK_CODE).json({auth : true, msg : 'Success', data : postWithComment});		
	}
}

module.exports = {
	'getAllUserPost': getAllUserPost,
	'getSinglePostWithComments' : getSinglePostWithComments,
}
