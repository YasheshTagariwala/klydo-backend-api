let Post = loadModal('Posts');
let Comment = loadModal('PostComment');
let Activity = loadController('ActivityController');
let ActivityModel = loadModal('Activity');
let Reaction = loadModal('PostReaction');
let _ = require('underscore');
let Validation = loadUtility('Validations');

//diary posts
let getAllDiaryPost = async (req, res) => {
	let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
	let [diaryPosts,err] = await catchError(Post				
		.with({'userProfile' : (q) => {
			q.select(['first_name','last_name']);			
			q.withSelect('userExtra',['profile_image']);			
		}})		
		.where({'profile_id':req.params.id,'post_published' : false})
		.select(['emotion','profile_id','id','post_content','post_published','post_title','post_hashes','created_at'])
		.orderBy('id','desc')
		.offset(offset)
		.limit(RECORED_PER_PAGE)
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

//Get Home Posts
let getAllHomePost = async(req, res) => {	
	let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
	let [posts,err] = await catchError(Post.select(['id','profile_id','post_content','post_title','post_media','post_hashes','emotion','created_at'])
		.withSelect('userProfile' ,['id','first_name','last_name'], (q) => {
			q.withSelect('userExtra', ['profile_image']);
			q.withSelect('userFollowings' ,['followings'], (q) => {
				q.where({'followers' : req.params.id , 'accepted' : true , 'blocked' : false});
			});
		})
		.withSelect('reaction' ,['reaction_id','profile_id'], (q) =>{
			q.where('profile_id',req.params.id);
		})
        .with({'comments' : (q1) => {
            q1.select(['comment_content','created_at','profile_id','id']);
            q1.withSelect('userProfile', ['first_name','last_name','id'] , (q2) => {
                q2.withSelect('userExtra',['profile_image']);
            });
            q1.offset(0);
            q1.orderBy('id','desc');
            q1.limit(5)
        }})
        // .where('post_published' , true)
		.whereNot('profile_id',req.params.id)
		.orderBy('id','desc')
		.offset(offset)
		.limit(RECORED_PER_PAGE)
		.get());

	if(err){
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	}else{
		if(!Validation.objectEmpty(posts)){			
			res.status(OK_CODE).json({auth : true, msg : 'Success', data : posts});		
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found' , data : []});		
		}					
	}
}

//get all reactions on a post
let getPostReactions = async (req, res) => {
    let [reactions,err] = await catchError(Reaction.select(['profile_id','reaction_id'])
        .withSelect('userProfile' ,['id','first_name','last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image']);
        })
        .where('post_id',req.params.id).get());
    if(err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    }
    res.status(OK_CODE).json({auth : true, msg : 'Success', data : reactions});
};

//get profile posts
let getAllProfilePost = async (req, res) => {
	let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
	let [profilePost,err] = await catchError(Post					
		.select(['emotion','profile_id','id','post_content','post_hashes','post_title','post_media','created_at','post_published'])
		.where({'profile_id':req.params.id})
		.orderBy('id','desc')
		.offset(offset)
		.limit(RECORED_PER_PAGE)
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

//get single post with comments
let getSinglePostWithComments = async (req ,res) => {	
	let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
	let [postWithComment,err] = await catchError(Post
		.select(['emotion','profile_id','id','post_content','post_hashes','post_title','post_media','created_at','post_published'])
		.with({'userProfile' : (q) => {			
				q.select(['first_name','last_name']);
				q.withSelect('userExtra',['profile_image']);			
			}})
		.with({'comments' : (q1) => {
				q1.select(['comment_content','created_at','profile_id','id']);
				q1.withSelect('userProfile', ['first_name','last_name','id'] , (q2) => {
					q2.withSelect('userExtra',['profile_image']);			
				});
				q1.offset(offset);
				q1.orderBy('id','desc');
				q1.limit(RECORED_PER_PAGE)
		}})								
		.where('id',req.params.id)
		.first());

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

//get comments for single posts
let getPostComments = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [postWithComment,err] = await catchError(Comment
        .select(['profile_id','comment_content','created_at','id'])
        .with({'userProfile' : (q) => {
                q.select(['first_name','last_name']);
                q.withSelect('userExtra',['profile_image']);
            }})
        .offset(offset)
        .orderBy('id','desc')
        .limit(RECORED_PER_PAGE)
        .where('post_id',req.params.id)
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
};

//add single post
let createPost = async (req, res) => {
    var post_media = null;
    let filename = '';
    if(req.files){
        post_media = req.files.post_media;
        filename = '';
        if(post_media){
            var moment = require('moment');
            if(post_media.length){
                filename = [];
                for(let i = 0; i < post_media.length; i++){
                    let fname = req.body.user_id + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + post_media[i].name.substring(post_media[i].name.lastIndexOf('.'));
                    filename.push(fname);
                    let [data,err] = await catchError(post_media[i].mv(MediaPath + '/' + fname));
                    if(err){
                        console.log(err);
                        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
                        return;
                    }
                }
                filename = filename.join();
            }else{
                filename = req.body.user_id + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + post_media.name.substring(post_media.name.lastIndexOf('.'));
                let [data,err] = await catchError(post_media.mv(MediaPath + '/' + filename));
                if(err){
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
            }
        }
    }

    let [activityId,err] = await catchError(Activity.createActivity(1));
    if(activityId == null || err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }

    let newPostData = {
        profile_id : req.body.user_id,
        post_content : req.body.content,
        post_title : req.body.title,
        post_media : (post_media) ? filename : null,
        post_hashes : req.body.post_hashes,
        post_published : true,
        emotion : req.body.emotion,
        activity_id : activityId
    };

    let [data,err1] = await catchError(Post.forge(newPostData).save());
    if(err1){
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }else{
        res.status(OK_CODE).json({auth : true,msg : "Posted"})
    }
}

//update post
let updatePost = async (req, res) => {

	// let postId = req.params.post;

	// let updatePostData = {
	// 	post_content : req.body.content,
	// 	post_media : (req.body.post_media) ? req.body.post_media : null,
	// 	post_hashes : req.body.post_hashes,
	// 	post_published : req.body.post_published,
	// 	emotion : req.body.emotion
	// }
	
	// let [data,err1] = await catchError(Post
	// 	.where({id : postId})
	// 	.save(updatePostData,{patch: true})
	// );
	// if(err1) {
	// 	console.log(err1);
	// 	res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
	// 	return;
	// } else {
	// 	res.status(OK_CODE).json({auth : true,msg : "Post Updated"})
	// }
}

//delete single post
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

//add comment to single post
let addComment = async (req, res) => {
    let [activityId,err] = await catchError(Activity.createActivity(3));
    if(activityId == null || err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }

    let commentData = {
        post_id : req.body.post_id,
        profile_id : req.body.user_id,
        comment_content : req.body.content,
        comment_type : 1,
        comment_media : "",
        comment_hashes : "",
        activity_id : activityId
    };

    let [data,err1] = await catchError(Comment.forge(commentData).save());
    if(err1){
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }else{
        res.status(OK_CODE).json({auth : true,msg : "Commented"})
    }
};

//add reaction to single post
let addReaction = async (req, res) => {
    let [data,err1] = await catchError(Reaction.where({
        "post_id" : req.body.post_id,
        "profile_id" : req.body.user_id
    }).first());
    if(err1){
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }else{
        if(data){
            let reactionData = {
                reaction_id : req.body.reaction_id,
            };

            let [reaction_data,err2] = await catchError(Reaction.where({
                "post_id" : req.body.post_id,
                "profile_id" : req.body.user_id
            }).save(reactionData,{patch : true}));

            if(err2){
                console.log(err1);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }
            res.status(OK_CODE).json({auth : true,msg : "Reaction Done"});
        }else{
            let [activityId,err] = await catchError(Activity.createActivity(4));
            if(activityId == null || err){
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }

            let reactionData = {
                post_id : req.body.post_id,
                reaction_id : req.body.reaction_id,
                activity_id : activityId,
                profile_id : req.body.user_id
            };

            let [reaction_data,err2] = await catchError(Reaction.forge(reactionData).save());
            if(err2){
                console.log(err1);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }
            res.status(OK_CODE).json({auth : true,msg : "Reaction Done"});
        }
    }
};

//filter post on profile
let filterProfilePost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [profilePost,err] = await catchError(Post
        .select(['emotion','profile_id','id','post_content','post_hashes','post_title','post_media','created_at','post_published'])
        .whereHas('reactions', (q) => {
            q.where('reaction_id',req.params.reaction_id);
            q.where({'profile_id':req.params.id})
        })
        .orderBy('id','desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
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

module.exports = {
	'getAllDiaryPost': getAllDiaryPost,
	'getAllProfilePost' : getAllProfilePost,
	'getSinglePostWithComments' : getSinglePostWithComments,
	'createPost' : createPost,
	'updatePost' : updatePost,
	'deletePost' : deletePost,
	'getAllHomePost' : getAllHomePost,
	'addComment' : addComment,
    'addReaction' : addReaction,
    'getPostReactions' : getPostReactions,
    'getPostComments' : getPostComments,
    'filterProfilePost' : filterProfilePost
};
