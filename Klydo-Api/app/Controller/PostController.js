let Post = require('../Models/Posts');
let catchError = require('../../Config/ErrorHandling');
let statusCode = require('../Utility/HTTPStatusCodes');
let Activity = require('./ActivityController');

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

let createPost = async (req, res) => {	
	let activityId = await Activity.createActivity(1);	
	console.log(activityId);
	res.json(activityId);
	// let newPost = new Post();
	// newPost.profile_id = req.body.user_id;
	// newPost.post_content = req.body.content;
	// newPost.post_media = (req.body.post_media) ? req.body.post_media : null;
	// newPost.post_hashes = req.body.post_hashes;
	// newPost.post_published = req.body.post_published;
	// newPost.post_type = (req.body.post_media) ? 2 : 1;
	// newPost.emotion = req.body.emotion;
	// newPost.activity_id = activityId;
	// newPost.save();
}

module.exports = {
	'getAllUserPost': getAllUserPost,
	'getSinglePostWithComments' : getSinglePostWithComments,
	'createPost' : createPost
}
