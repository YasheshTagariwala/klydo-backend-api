const bookshelf = loadConfig('Bookshelf.js');
const PostReport = loadV2Modal('PostReport');

let reportPost = async (req, res) => {

    if (!req.body.user_id || !req.body.post_id) {
        res.status(OK_CODE).json({auth: true, msg: "Missing Parameters"});
        return ;
    }

    let [post, err] = await catchError(PostReport.where({profile_id: req.body.user_id,post_id: req.body.post_id}).first());

    if (post) {
        res.status(OK_CODE).json({auth: true, msg: "You Already Reported This Post"});
    } else {
        let report = {
            profile_id: req.body.user_id,
            post_id: req.body.post_id,
            reason: req.body.reason
        };

        let [data, err] = await catchError(PostReport.forge(report).save());

        if (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        } else {
            res.status(OK_CODE).json({auth: true, msg: "Post Reported Successfully"});
        }
    }
};

module.exports = {
    'reportPost': reportPost,
};
