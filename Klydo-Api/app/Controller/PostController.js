let Post = require('../Models/Posts');
let Comment = require('../Models/PostComment');
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
	}else
		res.status(statusCode.OK_CODE).json({auth : true, msg : 'Success', data : postWithComment});		
}

let createPost = async (req, res) => {	
	let [activityId,err] = await catchError(Activity.createActivity(1));	
	if(activityId == null || err){
		console.log(err);
		res.status(statuscode.INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}

	let newPostData = {
		profile_id : req.body.user_id,
		post_content : req.body.content,
		post_media : (req.body.post_media) ? req.body.post_media : null,
		post_hashes : req.body.post_hashes,
		post_published : req.body.post_published,
		post_type : (req.body.post_media) ? 2 : 1,
		emotion : req.body.emotion,
		activity_id : activityId
	}			
	
	let [data,err1] = await catchError(Post.forge(newPostData).save());	
	if(err1){
		console.log(err1);
		res.status(statuscode.INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
		res.status(statusCode.OK_CODE).json({auth : true,msg : "Success"})
	}
}

let updatePost = async (req, res) => {

	let postId = req.body.post_id;

	let updatePostData = {
		post_content : req.body.content,
		post_media : (req.body.post_media) ? req.body.post_media : null,
		post_hashes : req.body.post_hashes,
		post_published : req.body.post_published,
		post_type : (req.body.post_media) ? 2 : 1,
		emotion : req.body.emotion
	}
	
	let [data,err1] = await catchError(Post
		.where({id : postId})
		.save(updatePostData,{patch: true})
	);
	if(err1) {
		console.log(err1);
		res.status(statusCode.INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	} else {
		res.status(statusCode.OK_CODE).json({auth : true,msg : "Success"})
	}
}

let deletePost = async (req, res) => {

	let postId = req.body.post_id;

	let [data,err1] = await catchError(Post.forge({id : postId}).destroy());
	if(err1) {
		console.log(err1);
		res.status(statusCode.INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : statusCode.INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	} else {
		res.status(statusCode.OK_CODE).json({auth : true,msg : "Success"})
	}
}

module.exports = {
	'getAllUserPost': getAllUserPost,
	'getSinglePostWithComments' : getSinglePostWithComments,
	'createPost' : createPost,
	'updatePost' : updatePost,
	'deletePost' : deletePost
}
