let FeelPals = loadModal('Feelpals');
let Activity = loadController('ActivityController');
let Validation = loadUtility('Validations');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');
let PushNotification = loadV1Controller('PushNotification');
let UserTokenMaster = loadV1Modal('UserTokenMaster');

let addFriend = async (req, res) => {
    let [check, err2] = await catchError(FeelPals
        .where({followers: req.body.user_id, followings: req.body.friend_id})
        .first());

    if (err2) {
        console.log(err2);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        if (!check) {
            let [activityId, err] = await catchError(Activity.createActivity(2));
            if (activityId == null || err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }

            let newFriend = {
                followers: req.body.user_id,
                followings: req.body.friend_id,
                activity_id: activityId
            };

            let [data, err1] = await catchError(FeelPals.forge(newFriend).save());
            if (err1) {
                console.log(err1);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            } else {
                let [token, err5] = await catchError(UserTokenMaster.where('profile_id', req.body.friend_id).first());
                if (err5) {
                    console.log(err5);
                } else {
                    if (token) {
                        token = token.toJSON();
                        let [doer, err] = await catchError(UserProfile.where('id', req.body.user_id).first());
                        doer = doer.toJSON();
                        await PushNotification.sendPushNotificationToSingleDevice(token.firebase_token, 4, doer.first_name.trim() + ' ' + doer.last_name.trim(), "", "0");
                    }
                }
                res.status(OK_CODE).json({auth: true, msg: "Friend Added", id: data.id})
            }
        } else {
            res.status(OK_CODE).json({auth: true, msg: "Request Already Sent"});
        }
    }
}

let acceptFriend = async (req, res) => {
    let fid = req.params.id;
    if (Validation.empty(fid)) {
        res.status(NO_CONTENT_CODE).json({auth: false, msg: NO_CONTENT_CODE});
        return;
    }

    let fellPalsData = {
        accepted: true
    };

    let [data, err] = await catchError(FeelPals
        .where({id: fid})
        .save(fellPalsData, {patch: true})
    );

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        let [data, err] = await catchError(FeelPals.where({id: fid}).first());
        data = data.toJSON();
        let [token, err5] = await catchError(UserTokenMaster.where('profile_id', data.followers).first());
        if (err5) {
            console.log(err5);
        } else {
            if (token) {
                token = token.toJSON();
                let [doer, err] = await catchError(UserProfile.where('id', data.followings).first());
                doer = doer.toJSON();
                await PushNotification.sendPushNotificationToSingleDevice(token.firebase_token, 7, doer.first_name.trim() + ' ' + doer.last_name.trim(), "", "0");
            }
        }
        res.status(OK_CODE).json({auth: true, msg: "Friend Request Accepted"})
    }
};

let rejectFriend = async (req, res) => {
    let fid = req.params.id;
    if (Validation.empty(fid)) {
        res.status(NO_CONTENT_CODE).json({auth: false, msg: NO_CONTENT_CODE});
        return;
    }

    let [data, err] = await catchError(FeelPals
        .forge({id: fid})
        .destroy()
    );

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Friend Request Rejected"})
    }
}

let getFollowers = async (req, res) => {
    let [friendData, err] = await catchError(FeelPals.select(['id', 'followers'])
        .withSelect('userProfileFollower', ['first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image', 'emotion'])
        })
        .where({'followings': req.params.id, 'accepted': true, 'blocked': false})
        .orderBy('id', 'desc')
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(friendData)) {
            if (req.params.friend_id) {
                let [profileData, err] = await catchError(FeelPals.select(['followers'])
                    .withSelect('userProfileFollower', ['first_name', 'last_name'], (q) => {
                        q.withSelect('userExtra', ['profile_image', 'emotion'])
                    })
                    .where({'followings': req.params.friend_id, 'accepted': true, 'blocked': false})
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
                            if (friendData[i].followers == profileData[j].followers) {
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

let getFollowings = async (req, res) => {
    let [friendData, err] = await catchError(FeelPals.select(['id', 'followings'])
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

//Get single Friend details
let getFriendDetail = async (req, res) => {
    let [users, err] = await catchError(UserProfile.with('userExtra')
        .with('userFollowers', (q) => {
            q.where({'followings': req.params.user_id});
        }).where({'id': req.params.id}).first());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: 'Success', data: users});
    }
};

let getPendingFriendRequests = async (req, res) => {
    let [friendData, err] = await catchError(FeelPals.select(['id', 'followers'])
        .withSelect('userProfileFollower', ['first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image', 'emotion'])
        })
        .where({'followings': req.params.id, 'accepted': false, 'blocked': false})
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

module.exports = {
    'addFriend': addFriend,
    'acceptFriend': acceptFriend,
    'rejectFriend': rejectFriend,
    'getFollowers': getFollowers,
    'getFollowings': getFollowings,
    'getFriendDetail': getFriendDetail,
    'getPendingFriendRequests': getPendingFriendRequests
}