let FeelPals = loadModal('Feelpals');
let Validation = loadUtility('Validations');


let getFollowings = async (req, res) => {
    let [friendData, err] = await catchError(FeelPals.select(['id', 'followings','is_favourite'])
        .whereHas('userProfileFollowing')
        .withSelect('userProfileFollowing', ['first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image', 'emotion'])
        })
        .where({'followers': req.params.id, 'accepted': true, 'blocked': false})
        .orderBy('id', 'desc')
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(friendData)) {
            if (req.params.friend_id) {
                let [profileData, err] = await catchError(FeelPals.select(['followings'])
                    .withSelect('userProfileFollowing', ['first_name', 'last_name'], (q) => {
                        q.withSelect('userExtra', ['profile_image', 'emotion'])
                    })
                    .where({'followers': req.params.friend_id, 'accepted': true, 'blocked': false})
                    .orderBy('id', 'desc')
                    .get());

                if (err) {
                    friendData = friendData.toJSON();
                    for (let i = 0; i < friendData.length; i++) {
                        friendData[i].is_mutual = false;
                    }
                } else {
                    friendData = friendData.toJSON();
                    profileData = profileData.toJSON();
                    for (let i = 0; i < friendData.length; i++) {
                        for (let j = 0; j < profileData.length; j++) {
                            if (friendData[i].followings == profileData[j].followings) {
                                friendData[i].is_mutual = true;
                                break;
                            } else {
                                friendData[i].is_mutual = false;
                            }
                        }
                    }
                }
            }
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: friendData});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
}

let getBubbleFriends = async (req, res) => {

    let [friendData, err] = await catchError(FeelPals.select(['id', 'followings'])
        .whereHas('userProfileFollowing')
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
    };

    let [data, err] = await catchError(FeelPals.where({'followings': req.params.friend_id, 'followers': req.params.user_id})
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
    };

    let [data, err] = await catchError(FeelPals.where({'followings': req.params.friend_id, 'followers': req.params.user_id})
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
    'getFollowings': getFollowings,
    'getBubbleFriends': getBubbleFriends,
    'addToBubble': addToBubble,
    'removeFromBubble': removeFromBubble
};