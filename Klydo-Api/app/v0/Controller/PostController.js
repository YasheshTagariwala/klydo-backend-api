let Post = loadModal('Posts');
let Comment = loadModal('PostComment');
let Activity = loadController('ActivityController');
let ActivityModel = loadModal('Activity');
let bookshelf = loadConfig('Bookshelf.js');
let Reaction = loadModal('PostReaction');
let _ = require('underscore');
let Validation = loadUtility('Validations');
let Graph = loadController('GraphController');

//diary posts
let getAllDiaryPost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [diaryPosts, err] = await catchError(Post
        .with({
            'userProfile': (q) => {
                q.select(['first_name', 'last_name']);
                q.withSelect('userExtra', ['profile_image']);
            }
        })
        .where({'profile_id': req.params.id, 'post_published': false})
        .select(['emotion', 'profile_id', 'id', 'post_content', 'post_published', 'post_title', 'post_hashes', 'created_at'])
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(diaryPosts)) {
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: diaryPosts});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
};

//Get Home Posts
let getAllHomePost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [posts, err] = await catchError(Post.select(['id', 'profile_id', 'post_content', 'post_title', 'post_media', 'post_hashes', 'emotion', 'created_at'])
        .withSelect('userProfile', ['id', 'first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image']);
            q.withSelect('userFollowings', ['followings'], (q) => {
                q.where({'followers': req.params.id, 'accepted': true, 'blocked': false});
            });
        })
        .whereHas('userProfile',(q) => {
            q.whereHas('userFollowings', (q) => {
                q.where({'followers': req.params.id, 'accepted': true, 'blocked': false})
            })
        })
        .withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
            q.where('profile_id', req.params.id);
        })
        .withSelect('comments', ['comment_content', 'created_at', 'profile_id', 'id'], (q1) => {
            q1.withSelect('userProfile', ['first_name', 'last_name', 'id'], (q2) => {
                q2.withSelect('userExtra', ['profile_image']);
            });
            q1.take(5);
            q1.orderBy('id', 'asc');
        })
        // .where('post_published' , true)
        .whereNot('profile_id', req.params.id)
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(posts)) {
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: posts});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
}

//get all reactions on a post
let getPostReactions = async (req, res) => {
    let [reactions, err] = await catchError(Reaction.select(['profile_id', 'reaction_id'])
        .withSelect('userProfile', ['id', 'first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image']);
        })
        .where('post_id', req.params.id).get());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    }
    res.status(OK_CODE).json({auth: true, msg: 'Success', data: reactions});
};

//get profile posts
let getAllProfilePost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [profilePost,err] = await catchError(Post
        .select(['emotion','profile_id','id','post_content','post_hashes','post_title','post_media','created_at','post_published'])
        .with({'userProfile' : (q) => {
                q.select(['first_name','last_name']);
                q.withSelect('userExtra',['profile_image']);
            },'comments' : (q1) => {
                q1.select(['comment_content','created_at','profile_id','id']);
                q1.withSelect('userProfile', ['first_name','last_name','id'] , (q2) => {
                    q2.withSelect('userExtra',['profile_image']);
                });
                q1.offset(0);
                q1.orderBy('id','asc');
                q1.limit(5)
            }})
        .withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
            q.where('profile_id', req.params.friend_id);
        })
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
let getSinglePostWithComments = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [postWithComment, err] = await catchError(Post
        .select(['emotion', 'profile_id', 'id', 'post_content', 'post_hashes', 'post_title', 'post_media', 'created_at', 'post_published'])
        .with({
            'userProfile': (q) => {
                q.select(['first_name', 'last_name']);
                q.withSelect('userExtra', ['profile_image']);
            }
        })
        .withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
            if(req.params.user_id){
                q.where('profile_id', req.params.user_id);
            }else {
                q.where('profile_id', null);
            }
        })
        .with({
            'comments': (q1) => {
                q1.select(['comment_content', 'created_at', 'profile_id', 'id']);
                q1.withSelect('userProfile', ['first_name', 'last_name', 'id'], (q2) => {
                    q2.withSelect('userExtra', ['profile_image']);
                });
                q1.take(RECORED_PER_PAGE);
                q1.orderBy('id', 'asc');
            }
        })
        .where('id', req.params.id)
        .first());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(postWithComment)) {
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: postWithComment});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
}

//get comments for single posts
let getPostComments = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [postWithComment, err] = await catchError(Comment
        .select(['profile_id', 'comment_content', 'created_at', 'id'])
        .with({
            'userProfile': (q) => {
                q.select(['first_name', 'last_name']);
                q.withSelect('userExtra', ['profile_image']);
            }
        })
        .offset(offset)
        .orderBy('id', 'desc')
        .limit(RECORED_PER_PAGE)
        .where('post_id', req.params.id)
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(postWithComment)) {
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: postWithComment});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
};

//add single post
let createPost = async (req, res) => {
    var post_media = null;
    let filename = '';
    if (req.files) {
        post_media = req.files.post_media;
        filename = '';
        if (post_media) {
            var moment = require('moment');
            if (post_media.length) {
                filename = [];
                for (let i = 0; i < post_media.length; i++) {
                    let fname = req.body.user_id + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + post_media[i].name.substring(post_media[i].name.lastIndexOf('.'));
                    filename.push(fname);
                    let [data, err] = await catchError(post_media[i].mv(MediaPath + '/' + fname));
                    if (err) {
                        console.log(err);
                        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                        return;
                    }
                }
                filename = filename.join();
            } else {
                filename = req.body.user_id + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + post_media.name.substring(post_media.name.lastIndexOf('.'));
                let [data, err] = await catchError(post_media.mv(MediaPath + '/' + filename));
                if (err) {
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
            }
        }
    }

    let [activityId, err] = await catchError(Activity.createActivity(1));
    if (activityId == null || err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }

    let newPostData = {
        profile_id: req.body.user_id,
        post_content: req.body.content,
        post_title: req.body.title,
        post_media: (post_media) ? filename : null,
        post_hashes: req.body.post_hashes,
        post_published: true,
        emotion: req.body.emotion,
        activity_id: activityId
    };

    let [data, err1] = await catchError(Post.forge(newPostData).save());
    await Graph.filterAndAddBeliefsFrom(req.body.user_id, req.body.content + ' ' + req.body.title);
    await Graph.addPost(data.id, req.body.title, req.body.content);
    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Posted"})
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

    let [data, err1] = await catchError(Post.forge({id: postId}).destroy());
    await Graph.deletePost(postId);
    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Post Deleted"})
    }
}

//add comment to single post
let addComment = async (req, res) => {
    let [activityId, err] = await catchError(Activity.createActivity(3));
    if (activityId == null || err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }

    let commentData = {
        post_id: req.body.post_id,
        profile_id: req.body.user_id,
        comment_content: req.body.content,
        comment_type: 1,
        comment_media: "",
        comment_hashes: "",
        activity_id: activityId
    };

    let [data, err1] = await catchError(Comment.forge(commentData).save());
    let [post, err2] = await catchError(Post.where('id', req.body.post_id).first());
    if (err2) {
        console.log(err2);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        post = post.toJSON();
        await Graph.addAffinity(req.body.user_id, post.profile_id);
        await Graph.filterAndAddBeliefsFrom(req.body.user_id, req.body.content);
    }
    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Commented"})
    }
};

//Delete Comment
let deleteComment = async (req, res) => {
    let [data, err] = await catchError(Comment.forge({id : req.params.id}).destroy());
    if(err) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    }else {
        res.status(OK_CODE).json({auth: true, msg: "Post Deleted"});
    }
};

//add reaction to single post Or Delete
let addReaction = async (req, res) => {
    let [data, err1] = await catchError(Reaction.where({
        "post_id": req.body.post_id,
        "profile_id": req.body.user_id
    }).first());
    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        if (data) {
            if (data.reaction_id === req.body.reaction_id) {
                let [del, err1] = await catchError(Reaction.forge({id: data.id}).destroy());
                if (err1) {
                    console.log(err1);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
                res.status(OK_CODE).json({auth: true, msg: "Reaction Deleted"});
            } else {
                let reactionData = {
                    reaction_id: req.body.reaction_id,
                };

                let [reaction_data, err2] = await catchError(Reaction.where({
                    "post_id": req.body.post_id,
                    "profile_id": req.body.user_id
                }).save(reactionData, {patch: true}));

                let [post, err3] = await catchError(Post.where('id', req.body.post_id).first());
                if (err3) {
                    console.log(err3);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                } else {
                    post = post.toJSON();
                    await Graph.addAffinity(req.body.user_id, post.profile_id);
                    await Graph.updateReactWeights(req.body.post_id, req.body.reaction_id);
                }

                let [reaction, err4] = await catchError(Reaction.select(['reaction_id', bookshelf.knex.raw('count(*) as count')]).whereHas('posts', (q) => {
                    q.where('profile_id', post.profile_id);
                }).orderBy('count', 'desc')
                    .query((q) => {
                        q.groupBy('reaction_id');
                        q.offset(0);
                        q.limit(2);
                    })
                    .get());

                if (err4) {
                    console.log(err1);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                } else {
                    reaction = reaction.toJSON();
                    if (reaction.hasOwnProperty('0') && reaction.hasOwnProperty('1')) {
                        await Graph.updateUserRype(post.profile_id, reaction[0].reaction_id, reaction[1].reaction_id);
                    }
                    if (reaction.hasOwnProperty('0')) {
                        await Graph.updateUserRype(post.profile_id, reaction[0].reaction_id, reaction[0].reaction_id);
                    }
                }
                await Graph.updateReactWeights(req.body.post_id, req.body.reaction_id);
                if (err2) {
                    console.log(err1);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
                res.status(OK_CODE).json({auth: true, msg: "Reaction Done"});
            }
        } else {
            let [activityId, err] = await catchError(Activity.createActivity(4));
            if (activityId == null || err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }

            let reactionData = {
                post_id: req.body.post_id,
                reaction_id: req.body.reaction_id,
                activity_id: activityId,
                profile_id: req.body.user_id
            };

            let [reaction_data, err2] = await catchError(Reaction.forge(reactionData).save());
            let [post, err3] = await catchError(Post.where('id', req.body.post_id).first());
            if (err3) {
                console.log(err3);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            } else {
                post = post.toJSON();
                await Graph.addAffinity(req.body.user_id, post.profile_id);
            }

            await Graph.updateReactWeights(req.body.post_id, req.body.reaction_id);
            if (err2) {
                console.log(err1);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }
            res.status(OK_CODE).json({auth: true, msg: "Reaction Done"});
        }
    }
};

//filter post on profile
let filterProfilePost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [profilePost, err] = await catchError(Post
        .select(['emotion', 'profile_id', 'id', 'post_content', 'post_hashes', 'post_title', 'post_media', 'created_at', 'post_published'])
        .with({'userProfile' : (q) => {
                q.select(['first_name','last_name']);
                q.withSelect('userExtra',['profile_image']);
            }})
        .withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
            q.where('profile_id', req.params.id);
        })
        .withSelect('comments', ['comment_content','created_at','profile_id','id'] , (q1) => {
            q1.withSelect('userProfile', ['first_name','last_name','id'] , (q2) => {
                q2.withSelect('userExtra',['profile_image']);
            });
            q1.take(5);
            q1.orderBy('id','asc');
        })
        .where((q) => {
            if (isNaN(req.params.reaction_id)) {
                q.whereRaw("lower(post_title) like '%" + req.params.reaction_id.toLowerCase() + "%'" +
                    " or lower(post_content) like '%" + req.params.reaction_id.toLowerCase() + "%'");
                q.where('profile_id',req.params.id)
            } else {
                q.whereHas('reactions', (q) => {
                    q.where('reaction_id', req.params.reaction_id);
                    q.where({'profile_id': req.params.id})
                })
            }
        })
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(profilePost)) {
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: profilePost});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
};

module.exports = {
    'getAllDiaryPost': getAllDiaryPost,
    'getAllProfilePost': getAllProfilePost,
    'getSinglePostWithComments': getSinglePostWithComments,
    'createPost': createPost,
    'updatePost': updatePost,
    'deletePost': deletePost,
    'getAllHomePost': getAllHomePost,
    'addComment': addComment,
    'addReaction': addReaction,
    'getPostReactions': getPostReactions,
    'getPostComments': getPostComments,
    'filterProfilePost': filterProfilePost,
    'deleteComment' : deleteComment
};
