let Post = loadModal('Posts');
let Comment = loadModal('PostComment');
let Activity = loadController('ActivityController');
let ActivityModel = loadModal('Activity');
let bookshelf = loadConfig('Bookshelf.js');
let Reaction = loadModal('PostReaction');
let _ = require('underscore');
let Validation = loadUtility('Validations');
let Graph = loadController('GraphController');

let fetchEditablePost = async (req, res) => {
};

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
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
            }
        }
    }

    // let [activityId, err] = await catchError(Activity.createActivity(1));
    // if (activityId == null || err) {
    //     console.log(err);
    //     res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
    //     return;
    // }

    let newPostData = {
        //profile_id: req.body.user_id,
        post_content: req.body.content,
        post_title: req.body.title,
        post_media: (post_media) ? filename : null,
        //post_hashes: req.body.post_hashes,
        //post_published: true,
        //emotion: req.body.emotion,
        //activity_id: activityId
    };

    let [data, err1] = await catchError(Post.where({'id': req.body.post_id})
        .save(newPostData, {patch: true})
    );

    //TODO:Add Graph API for update post here.

    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Post updated."})
    }
};


module.exports = {
    'fetchEditablePost': fetchEditablePost,
    'updatePost': updatePost
};
