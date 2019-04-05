let Post = loadModal('Posts');
let PostWatch = loadV1Modal('PostsWatch');
let Graph = loadV1Controller('GraphController');
let CommentReaction = loadV1Modal('CommentReaction');
let Activity = loadController('ActivityController');
let ActivityV1 = loadV1Controller('ActivityController');
let PushNotification = loadV1Controller('PushNotification');

let updatePost = async (req, res) => {

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
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
            }
        }
    }

    let newPostData = null;
    if (post_media) {
        newPostData = {
            post_content: req.body.content,
            post_title: req.body.title,
            post_media: filename,
            post_chips: Graph.extractChips(req.body.title)
        };
    } else {
        if (req.body.post_media) {
            newPostData = {
                post_content: req.body.content,
                post_title: req.body.title,
                post_chips: Graph.extractChips(req.body.content),
                post_media: null
            };
        } else {
            newPostData = {
                post_content: req.body.content,
                post_title: req.body.title,
                post_chips: Graph.extractChips(req.body.content)
            };
        }
    }

    let [data, err1] = await catchError(Post.where({'id': req.body.post_id})
        .save(newPostData, {patch: true})
    );

    await Graph.extractChips(req.body.content, req.body.post_id);

    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Post updated."})
    }
};

//add or remove reaction to single comment
let addReaction = async (req, res) => {
    let [data, err1] = await catchError(CommentReaction
        .with({'userProfile' :  (q) => {
                q.with('userExtra');
            },
            'postComment' : (q) => {
                q.with('userProfile' ,(q) => {
                    q.with('token');
                });
            }})
        .where({"comment_id": req.body.comment_id,"profile_id": req.body.user_id}).first());
    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        if (data) {
            data = data.toJSON();
            if (data.reaction_id == req.body.reaction_id) {
                let [del, err1] = await catchError(CommentReaction.forge({id: data.id}).destroy());
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

                let [reaction_data, err2] = await catchError(CommentReaction.where({
                    "comment_id": req.body.comment_id,
                    "profile_id": req.body.user_id
                }).save(reactionData, {patch: true}));

                if (err2) {
                    console.log(err2);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                } else {
                    await PushNotification.sendPushNotificationToSingleDevice(data.postComment.userProfile.token.firebase_token,
                        10, data.userProfile.first_name.trim() + ' ' + data.userProfile.last_name.trim(),
                        req.body.reaction_id, req.body.comment_id + "-" + data.postComment.post_id, data.userProfile.userExtra.profile_image);
                }
                res.status(OK_CODE).json({auth: true, msg: "Reaction Done"});
            }
        } else {
            let [activityId, err] = await catchError(Activity.createActivity(9));
            if (activityId == null || err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }

            let reactionData = {
                comment_id: req.body.comment_id,
                reaction_id: req.body.reaction_id,
                activity_id: activityId,
                profile_id: req.body.user_id
            };

            let [reaction_data, err2] = await catchError(CommentReaction.forge(reactionData).save());
            if (err2) {
                console.log(err2);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            } else {
                let [data, err1] = await catchError(CommentReaction
                    .with({'userProfile' :  (q) => {
                            q.with('userExtra');
                        },
                        'postComment' : (q) => {
                            q.with('userProfile' ,(q) => {
                                q.with('token');
                            });
                        }})
                    .where({"id": reaction_data.id}).first());

                if (err1) {
                    console.log(err1);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                } else {
                    data = data.toJSON();
                    await PushNotification.sendPushNotificationToSingleDevice(data.postComment.userProfile.token.firebase_token,
                        10, data.userProfile.first_name.trim() + ' ' + data.userProfile.last_name.trim(),
                        req.body.reaction_id, req.body.comment_id + "-" + data.postComment.post_id, data.userProfile.userExtra.profile_image);
                }
                res.status(OK_CODE).json({auth: true, msg: "Reaction Done"});
            }
        }
    }
};

let addToWatch = async (req, res) => {
    let [checkData, err1] = await catchError(PostWatch.where({
        'profile_id': req.body.profile_id,
        'post_id': req.body.post_id
    }).first());

    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {

        if (checkData) {
            checkData = checkData.toJSON();
            let is_watched = false;
            if(!checkData.watch){
                is_watched = true;
            }
            let watch = {
                watch: is_watched
            };
            let [data, err] = await catchError(PostWatch.where({'profile_id': req.body.profile_id, 'post_id': req.body.post_id})
                .save(watch, {patch: true})
            );

            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            } else {
                if(is_watched) {
                    res.status(OK_CODE).json({auth: true, msg: "Added post to your watchlist."});
                }else {
                    res.status(OK_CODE).json({auth: true, msg: "Removed post from your watchlist."});
                }
            }
        } else {
            let insertData = {
                'profile_id': req.body.profile_id,
                'post_id': req.body.post_id,
                'watch': true
            };

            let [insert, err] = await catchError(PostWatch.forge(insertData).save());

            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }else {
                res.status(OK_CODE).json({auth: true, msg: "Added post to your watchlist."});
            }
        }
    }
};

let getAllWatchPost = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [posts,err] = await catchError(PostWatch
        .withSelect('posts',['emotion', 'profile_id', 'id', 'post_content', 'post_published', 'post_title', 'post_hashes', 'created_at'] , (q) => {
            q.with({'userProfile': (q) => {
                    q.select(['first_name', 'last_name']);
                    q.withSelect('userExtra', ['profile_image']);
                }
            })
        })
        .where('profile_id',req.params.user_id)
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get()
    );

    if(err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
    }else {
        res.status(OK_CODE).json({auth: true, msg: "Data Found",data : posts});
    }
};

module.exports = {
    'updatePost': updatePost,
    'addReaction': addReaction,
    'addToWatch': addToWatch,
    'getAllWatchPost' : getAllWatchPost
};
