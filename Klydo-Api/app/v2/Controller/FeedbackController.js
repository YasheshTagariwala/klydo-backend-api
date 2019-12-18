const bookshelf = loadConfig('Bookshelf.js');
const Feedback = loadV2Modal('Feedback');

let addFeedback = async (req, res) => {
    let feedback = {
        profile_id: req.body.user_id,
        feedback_type: req.body.type,
        feedback_content: req.body.content,
        feedback_for: req.body.feedback_for
    };

    let [data, err] = await catchError(Feedback.forge(feedback).save());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Feedback Reported Successfully"});
    }
};

let getAllFeedback = async (req, res) => {
    let [data, err] = await catchError(Feedback.where((q) => {
        if (req.query && req.query.type) {
            q.where('feedback_type', req.query.type);
        }
    }).withSelect('userProfile',['id', 'first_name', 'middle_name', 'last_name',]).get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        let msg = data.length > 0 ? 'Success' : 'No Feedback Found';
        res.status(OK_CODE).json({auth: true, msg: msg, data: data});
    }
};

module.exports = {
    'addFeedback': addFeedback,
    'getAllFeedback' : getAllFeedback
};
