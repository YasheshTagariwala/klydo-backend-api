let FeelPals = loadModal('Feelpals');
let Activity = loadController('ActivityController');
let Validation = loadUtility('Validations');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');

let getBubbleFriends = async (req, res) => {

    let [friendData, err] = await catchError(FeelPals.select(['id', 'followings'])
        .withSelect('userProfileFollowing', ['first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image', 'emotion'])
        })
        .where({'followers': req.params.user_id, 'accepted': true, 'blocked': false, 'is_favourite': true})
        .orderBy('id', 'desc')
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(friendData)) {
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: friendData});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }

};


let addToBubble = async (req, res) => {

    let bubble = {
        is_favourite: true
    }

    let [data, err] = await catchError(FeelPals.where({'followings': req.body.friend_id, 'followers': req.body.user_id})
        .save(bubble, {patch: true})
    );

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Added to your bubble."});
    }
};

let removeFromBubble = async (req, res) => {

    let bubble = {
        is_favourite: false
    }

    let [data, err] = await catchError(FeelPals.where({'followings': req.body.friend_id, 'followers': req.body.user_id})
        .save(bubble, {patch: true})
    );

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Removed from your bubble."});
    }

};

module.exports = {
    'getBubbleFriends': getBubbleFriends,
    'addToBubble': addToBubble,
    'removeFromBubble': removeFromBubble
}