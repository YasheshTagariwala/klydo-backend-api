let Post = loadModal('Posts');
let Graph = loadV1Controller('GraphController');

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


module.exports = {
    'updatePost': updatePost
};
