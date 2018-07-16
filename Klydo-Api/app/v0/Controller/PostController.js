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
			q.select(bookshelf.knex.raw(['trim(first_name) as fname','trim(last_name) as lname']));			
			q.withSelect('userExtra',[bookshelf.knex.raw('trim(profile_image) as dp')]);			
		}})		
		.where({'profile_id':req.params.id,'post_published' : false})
		.select(bookshelf.knex.raw(['trim(emotion) as emotion','profile_id','id'
					,'trim(post_content) as content','post_published','trim(post_hashes) as hashes','to_char(created_at,\'DD-MM-YYYY\') as date']))		
		.orderBy('id','desc')					
		.limit(10)		
		.get());		
			
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(diaryPosts)){
			let finalData = _.map(diaryPosts.toJSON() , (data) => {
				return {
					'emotion' : data.emotion,
					'uid' : data.profile_id, 
					'pid' : data.id,
					'content' : data.content,
					'published' : data.post_published,
					'hash' : data.hashes,
					'date' : data.date,			
					'name' : data.userProfile.fname,
					'lname' : data.userProfile.lame,				
					"dp" : data.userProfile.userExtra.dp				
				}
			});
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : finalData});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found' , data : []});		
		}					
	}	
};

//profile posts
let getAllProfilePost = async (req, res) => {
	let [profilePost,err] = await catchError(Post					
		.select(bookshelf.knex.raw(['trim(emotion) as emotion','profile_id','id','trim(post_content) as content'
					,'trim(post_hashes) as hash','to_char(created_at,\'DD-MM-YYYY\') as date','post_published']))			
		.where({'profile_id':req.params.id,'post_published' : true})		
		.orderBy('id','desc')
		.get());				
	
	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(profilePost)){
			let finalData = _.map(profilePost.toJSON() , (data) => {
				return {
					'emotion' : data.emotion,
					'uid' : data.profile_id, 
					'pid' : data.id,
					'content' : data.content,
					'published' : data.post_published,
					'hash' : data.hash,
					'date' : data.date,			
				}
			});
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : finalData});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}		
	}	
};

let getSinglePostWithComments = async (req ,res) => {	
	let [postWithComment,err] = await catchError(Post
		.select(bookshelf.knex.raw(['trim(emotion) as emotion','profile_id','id','trim(post_content) as content'
					,'trim(post_hashes) as hash','to_char(created_at,\'DD-MM-YYYY\') as date','post_published']))
		.with({'userProfile' : (q) => {			
				q.select(bookshelf.knex.raw(['trim(first_name) as fname','trim(last_name) as lname']));
				q.withSelect('userExtra',[bookshelf.knex.raw('trim(profile_image) as dp')]);			
			}})
		.with({'comments' : (q1) => {
				q1.select([bookshelf.knex.raw(['trim(comment_content) as content','to_char(created_at,\'DD-MM-YYYY\')','profile_id','id'])]);				
				q1.withSelect('userProfile', [bookshelf.knex.raw(['trim(first_name) as fname','trim(last_name) as lname','id'])] , (q2) => {
					q2.withSelect('userExtra',[bookshelf.knex.raw('trim(profile_image) as dp')]);			
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
			let finalData = _.map(postWithComment.toJSON() , (data) =>{
				let temp_data = [];
				let comment_array = data.comments.forEach(comment => {					
						temp_data.push({
							'content' : comment.content,
							'date' : comment.date,	
							'uid' : comment.profile_id,
							'cid' : comment.id,												
							'name' : comment.userProfile.fname,
							'lname' : comment.userProfile.lname,							
							'dp' : comment.userProfile.userExtra.dp																			
						});											
				})
				return {
					'emotion' : data.emotion,
					'uid' : data.profile_id, 
					'pid' : data.id,
					'content' : data.content,
					'published' : data.post_published,
					'hash' : data.hashes,
					'date' : data.date,				
					'name' : data.userProfile.fname,
					'lname' : data.userProfile.lname,					
					"dp" : data.userProfile.userExtra.dp,
					'comments' : temp_data		
				}
			});
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : finalData});		
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
