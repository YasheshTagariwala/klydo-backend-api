let UserProfile = loadModal('UserProfile');
let UserExtra = loadModal('UserExtra');
let Reaction = loadModal('PostReaction');
let KlyspaceData = loadModal('KlyspaceData');
let Klyspace = loadModal('Klyspace');
let bookshelf = loadConfig('Bookshelf.js');
let UserTokenMaster = loadV1Modal('UserTokenMaster');
let PushNotification = loadV1Controller('PushNotification');
let Activity = loadController('ActivityController');
let ActivityV1 = loadV1Controller('ActivityController');

//Get single User details
let getUserDetail = async (req, res) => {
    var [users, err] = await catchError(UserProfile.select(['id', 'first_name', 'middle_name'
        , 'last_name', 'dob', 'city', 'gender', 'user_email', 'username', 'mobile_number', 'about_me'])
        .withSelect('userExtra', ['id', 'report_count', 'is_reported', 'profile_privacy',
            'profile_image', 'is_verified', 'is_paid', 'interest', 'emotion', 'avg_emotions',
            'avg_interests', 'hobbies'])
        .withSelect('posts', ['emotion', 'profile_id', 'id', 'post_content', 'post_hashes', 'post_chips', 'post_title', 'post_media', 'created_at', 'post_published'], (q) => {
            q.with({
                'userProfile': (q) => {
                    q.select(['first_name', 'last_name']);
                    q.withSelect('userExtra', ['profile_image']);
                }
            });
            q.where({'profile_id': req.params.id});
            q.orderBy('id', 'desc');
            q.offset(0);
            q.limit(RECORED_PER_PAGE);
            if (req.params.friend_id) {
                q.withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
                    q.where('profile_id', req.params.friend_id);
                })
            }
            q.with({
                'comments': (q1) => {
                    q1.select(['comment_content', 'created_at', 'profile_id', 'id']);
                    q1.withSelect('userProfile', ['first_name', 'last_name', 'id'], (q2) => {
                        q2.withSelect('userExtra', ['profile_image']);
                    });
                    q1.offset(0);
                    q1.orderBy('id', 'desc');
                    q1.limit(5)
                }
            })
        })
        .with('userFollowings', (q) => {
            if (req.params.friend_id) {
                q.select(['id', 'followers', 'accepted', 'is_favourite']);
                q.where('followers', req.params.friend_id);
            }
        })
        .where({'id': req.params.id}).first());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        let [reaction, err1] = await catchError(Reaction.select(['reaction_id', bookshelf.knex.raw('count(*) as count')]).whereHas('posts', (q) => {
            q.where('profile_id', req.params.id);
        }).orderBy('count', 'desc')
            .query((q) => {
                q.groupBy('reaction_id');
                // q.offset(0);
                // q.limit(2);
            })
            .get());
        if (err1) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        } else {
            if (users) {
                users = users.toJSON();
                users.reaction = reaction;
                users.klyspace_data = null;
                let [klySpaceData, err1] = await catchError(KlyspaceData.select('klyspace_data')
                    .where('doee_profile_id', req.params.id)
                    // .whereNot('doer_profile_id', req.params.id)
                    .get());
                if (klySpaceData) {
                    klySpaceData = klySpaceData.toJSON();

                    let [variables, err2] = await catchError(Klyspace.select(['id'])
                        .where('status', true)
                        .orderBy('id', 'asc')
                        .get());

                    variables = variables.toJSON();

                    let vector = [];
                    for (let i = 0; i < variables.length; i++) {
                        let tempData = klySpaceData.filter((obj) => {
                            return obj.klyspace_data.indexOf((+variables[i].id)) > -1 || obj.klyspace_data.indexOf(variables[i].id) > -1
                        });

                        let countData = {
                            'klyspace_id': variables[i].id,
                            'count': tempData.length
                        };
                        vector.push(countData);
                    }

                    vector.sort(SortByID);
                    vector = vector.splice(0, 8);

                    users.klyspace_data = vector;
                }
            } else {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }
            res.status(OK_CODE).json({auth: true, msg: 'Success', data: users});
        }
    }
};

function SortByID(x, y) {
    return y.count - x.count;
}

let updateProfileImage = async (req, res) => {
    // let [user,err] = await catchError(UserExtra.where('user_profile_id',req.body.user_id).first());
    // if(err){
    //     console.log(err);
    //     res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
    //     return;
    // }
    //
    // user = user.toJSON();
    // if(user.profile_image != null){
    // 	fs.unlink(MediaPath + '/' + user.profile_image, (e) => {
    // 		if(e) throw e;
    // 	});
    // }
    let moment = require('moment');
    let profile_image = req.files.profile_image;
    let filename = req.body.user_id + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + profile_image.name.substring(profile_image.name.lastIndexOf('.'));
    let [data, err1] = await catchError(profile_image.mv(MediaPath + '/' + filename));
    if (err1) {
        console.log(err1);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    }

    let [users, err] = await catchError(UserExtra.where('id', req.body.user_id).first());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        let activity_id = null;
        if (users.toJSON().activity_id == null) {
            let [activityId, err1] = await catchError(Activity.createActivity(7));
            if (activityId == null || err1) {
                console.log(err1);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }

            activity_id = activityId;
        } else {
            let [activityId, err1] = await catchError(ActivityV1.updateActivityId(7, users.toJSON().activity_id));
            if (activityId == null || err1) {
                console.log(err1);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                return;
            }
            activity_id = activityId;
        }

        let user_data = {
            profile_image: filename,
            activity_id: activity_id
        };

        let [update_data, err2] = await catchError(UserExtra.where('user_profile_id', req.body.user_id).save(user_data, {patch: true}));
        if (err2) {
            console.log(err2);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        }
    }

    let [token, err5] = await catchError(UserTokenMaster.whereRaw('profile_id in (select followers from feelpals where followings = ' + req.body.user_id + ' and is_favourite = true)').get());
    if (err5) {
        console.log(err5);
    } else {
        if (token) {
            token = token.toJSON();
            let tokens = [];
            for (let i = 0; i < token.length; i++) {
                tokens.push(token[i].firebase_token);
            }
            let [doer, err] = await catchError(UserProfile.with('userExtra').where('id', req.body.user_id).first());
            doer = doer.toJSON();
            await PushNotification.sendPushNotificationToMultipleDevice(tokens, 9, doer.first_name.trim() + ' ' + doer.last_name.trim(), "", req.body.user_id, doer.userExtra.profile_image);
        }
    }
    res.status(OK_CODE).json({auth: true, msg: "Profile Picture Updated Successfully", data: filename});
};

//Change User Status
let changeStatus = async (req, res) => {
    if (req.body.status.length > 140) {
        res.status(OK_CODE).json({auth: true, msg: "Status Too Long Only 140 Chars Allowed"});
    } else {

        let [user, err1] = await catchError(UserProfile.where('id', req.body.user_id).first());
        if (err1) {
            console.log(err1);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        } else {
            let activity_id = null;
            if (user.toJSON().activity_id == null) {
                let [activityId, err1] = await catchError(Activity.createActivity(8));
                if (activityId == null || err1) {
                    console.log(err1);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }

                activity_id = activityId;
            } else {
                let [activityId, err1] = await catchError(ActivityV1.updateActivityId(8, user.toJSON().activity_id));
                if (activityId == null || err1) {
                    console.log(err1);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
                activity_id = activityId;

            }
            let profile = {
                about_me: req.body.status,
                activity_id: activity_id
            }

            let [data, err] = await catchError(UserProfile.where({'id': req.body.user_id})
                .save(profile, {patch: true})
            );

            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            } else {
                let [token, err5] = await catchError(UserTokenMaster.whereRaw('profile_id in (select followers from feelpals where followings = ' + req.body.user_id + ' and is_favourite = true)').get());
                if (err5) {
                    console.log(err5);
                } else {
                    if (token) {
                        token = token.toJSON();
                        let tokens = [];
                        for (let i = 0; i < token.length; i++) {
                            tokens.push(token[i].firebase_token);
                        }
                        let [doer, err] = await catchError(UserProfile.with('userExtra').where('id', req.body.user_id).first());
                        doer = doer.toJSON();
                        await PushNotification.sendPushNotificationToMultipleDevice(tokens, 8, doer.first_name.trim() + ' ' + doer.last_name.trim(), "", "0", doer.userExtra.profile_image);
                    }
                }
                res.status(OK_CODE).json({auth: true, msg: "Status Updated Successfully"});
            }
        }
    }
};

module.exports = {
    'getUserDetail': getUserDetail,
    'updateProfileImage': updateProfileImage,
    'changeStatus': changeStatus
};
