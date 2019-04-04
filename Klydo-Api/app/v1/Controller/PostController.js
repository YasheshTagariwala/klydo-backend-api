let Post = loadModal('Posts');
let PostWatch = loadModal('PostsWatch');
let Graph = loadV1Controller('GraphController');
let CommentReaction = loadModal('CommentReaction');
let Activity = loadController('ActivityController');
let ActivityV1 = loadV1Controller('ActivityController');

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
    let [data, err1] = await catchError(CommentReaction.where({
        "comment_id": req.body.post_id,
        "profile_id": req.body.user_id
    }).first());
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
                    "comment_id": req.body.post_id,
                    "profile_id": req.body.user_id
                }).save(reactionData, {patch: true}));

                let [post, err3] = await catchError(CommentReaction.where('id', req.body.comment_id).first());
                if (err3) {
                    console.log(err3);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                } else {
                    //TODO:Check here.
                    post = post.toJSON();
                    let [token, err] = await catchError(UserTokenMaster.where('profile_id', post.profile_id).first());
                    if (err) {
                        console.log(err);
                    } else {
                        if (token) {
                            token = token.toJSON();
                            let [doer, err] = await catchError(UserProfile.with('userExtra').where('id', req.body.user_id).first());
                            doer = doer.toJSON();
                            await PushNotification.sendPushNotificationToSingleDevice(token.firebase_token, 1, doer.first_name.trim() + ' ' + doer.last_name.trim(), req.body.reaction_id, req.body.post_id, doer.userExtra.profile_image);
                        }
                    }
                    await Graph.addAffinity(req.body.user_id, post.profile_id);
                    await Graph.updateReactWeights(req.body.post_id, req.body.reaction_id);
                }

                let [reaction, err4] = await catchError(CommentReaction.select(['reaction_id', bookshelf.knex.raw('count(*) as count')]).whereHas('postComment', (q) => {
                    q.where('comment_id', post.comment_id);
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
            let [activityId, err] = await catchError(Activity.createActivity(9));
            if (activityId == null || err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }

            let reactionData = {
                comment_id: req.body.comment_id,
                reaction_id: req.body.reaction_id,
                activity_id: activityId,
                profile_id: req.body.user_id
            };

            let [reaction_data, err2] = await catchError(CommentReaction.forge(reactionData).save());
            let [post, err3] = await catchError(Post.where('id', req.body.comment_id).first());
            if (err3) {
                console.log(err3);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            } else {
                //TODO:Check here.
                post = post.toJSON();
                let [token, err] = await catchError(UserTokenMaster.where('profile_id', post.profile_id).first());
                if (err) {
                    console.log(err);
                } else {
                    if (token) {
                        token = token.toJSON();
                        let [doer, err] = await catchError(UserProfile.with('userExtra').where('id', req.body.user_id).first());
                        doer = doer.toJSON();
                        await PushNotification.sendPushNotificationToSingleDevice(token.firebase_token, 1, doer.first_name.trim() + ' ' + doer.last_name.trim(), req.body.reaction_id, req.body.post_id, doer.userExtra.profile_image);
                    }
                }
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

            let watch = {
                watch: true
            };

            let [data, err] = await catchError(PostWatch.where({'profile_id': req.params.profile_id, 'post_id': req.params.post_id})
                .save(watch, {patch: true})
            );

            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            } else {
                res.status(OK_CODE).json({auth: true, msg: "Added post to your watchlist."});
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
            }
        }
    }
};

let removeFromWatch = async (req, res) => {

    let watch = {
        watch: false
    };

    let [data, err] = await catchError(PostWatch.where({
        'profile_id': req.params.profile_id,
        'post_id': req.params.post_id
    }).save(watch, {patch: true}));

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Removed post from your watchlist."});
    }
};

module.exports = {
    'updatePost': updatePost,
    'addReaction': addReaction,
    'addToWatch': addToWatch,
    'removeFromWatch': removeFromWatch
};
