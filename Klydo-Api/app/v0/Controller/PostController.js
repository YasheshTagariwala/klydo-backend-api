let Post = require(APP_MODEL_PATH + 'Posts');
let Comment = require(APP_MODEL_PATH + 'PostComment');
let Activity = require(APP_CONTROLLER_PATH + 'ActivityController');
let _ = require('underscore');
let Validation = require(APP_UTILITY_PATH + 'Validations');
const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

//diary posts
let getAllDiaryPost = async (req, res) => {
	let [diaryPosts,err] = await catchError(Post				
		.with({'userProfile' : (q) => {
			q.select(['first_name','last_name']);			
			q.withSelect('userExtra',['profile_image']);			
		}})		
		.where({'profile_id':req.params.id,'post_published' : false})
		.select(['emotion','profile_id','id','post_content','post_published','post_hashes','created_at'])
		.orderBy('id','desc')
		.limit(10)
		.get());		
			
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(diaryPosts)){			
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : diaryPosts});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found' , data : []});		
		}					
	}	
};

//profile posts
let getAllProfilePost = async (req, res) => {
	let [profilePost,err] = await catchError(Post					
		.select(['emotion','profile_id','id','post_content','post_hashes','created_at','post_published'])			
		.where({'profile_id':req.params.id,'post_published' : true})		
		.orderBy('id','desc')
		.get());				
	
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(profilePost)){			
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : profilePost});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}		
	}	
};

let getSinglePostWithComments = async (req ,res) => {	
	let [postWithComment,err] = await catchError(Post
		.select(['emotion','profile_id','id','post_content','post_hashes','created_at','post_published'])
		.with({'userProfile' : (q) => {			
				q.select(['first_name','last_name']);
				q.withSelect('userExtra',['profile_image']);			
			}})
		.with({'comments' : (q1) => {
				q1.select(['comment_content','created_at','profile_id','id']);
				q1.withSelect('userProfile', ['first_name','last_name','id'] , (q2) => {
					q2.withSelect('userExtra',['profile_image']);			
				})
		}})								
		.where('id',req.params.id)
		.get());				

	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(postWithComment)){			
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : postWithComment});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}
	}			
}

let createPost = async (req, res) => {	
	let [activityId,err] = await catchError(Activity.createActivity(1));	
	if(activityId == null || err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
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
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
		res.status(OK_CODE).json({auth : true,msg : "Posted"})
	}
}

let updatePost = async (req, res) => {

	let postId = req.params.post;

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
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	} else {
		res.status(OK_CODE).json({auth : true,msg : "Post Updated"})
	}
}

let deletePost = async (req, res) => {

	let postId = req.params.post;

	let [data,err1] = await catchError(Post.forge({id : postId}).destroy());
	if(err1) {
		console.log(err1);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	} else {
		res.status(OK_CODE).json({auth : true,msg : "Post Deleted"})
	}
}

module.exports = {
	'getAllDiaryPost': getAllDiaryPost,
	'getAllProfilePost' : getAllProfilePost,
	'getSinglePostWithComments' : getSinglePostWithComments,
	'createPost' : createPost,
	'updatePost' : updatePost,
	'deletePost' : deletePost
}
