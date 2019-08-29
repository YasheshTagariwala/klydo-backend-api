let Activity = loadModal('Activity');
let Validation = loadUtility('Validations');
let Feelpals = loadModal('Feelpals');

let ActivityTypes = {
    '1': 'Add Post',
    '2': 'Add Friend',
    '3': 'Add Comment',
    '4': 'Add Reaction',
    '5': 'Add Slam Reply',
    '6': 'Add/Update Kly-Web Data',
    '7': 'Add/Update User Profile',
    '8': 'Add/Update Status',
    '9': 'Add/Update Comment Reaction'
};

let createActivity = async activityType => {
    let [data, err] = await catchError(Activity.forge({activity_type: activityType}).save());
    if (err)
        return null;
    else
        return data.id;
};

let getUserActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [activityData, err] = await catchError(Activity
        .select(['id', 'activity_type', 'created_at'])
        .with({
            'comments': (q) => {
                q.select(['post_id', 'profile_id']);
                q.withSelect('userProfile', ['id', 'first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image']);
                });
            }, 'reactions': (q) => {
                q.select(['post_id', 'profile_id', 'reaction_id']);
                q.withSelect('userProfile', ['id', 'first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image']);
                });
            }, 'feelpals': (q) => {
                q.select(['followers', 'followings']);
                q.withSelect('userProfileFollower', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
                q.withSelect('userProfileFollowing', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
            }
        })
        .where((q) => {
            q.whereHas('comments', (q) => {
                q.whereNot('profile_id', req.params.id);
                q.whereHas('posts', (q) => {
                    q.where('profile_id', req.params.id)
                })
            });
            q.orWhereHas('reactions', (q) => {
                q.whereNot('profile_id', req.params.id);
                q.whereHas('posts', (q) => {
                    q.where('profile_id', req.params.id)
                })
            });
            q.orWhereHas('feelpals', (q) => {
                q.where('followers', req.params.id);
                q.where('accepted', true);
            });
        })
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(activityData)) {
            res.status(OK_CODE).json({auth: true, msg: "Success", data: activityData});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
};

let getAroundYouActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let Query = await Feelpals.select('followers').where('followings',req.params.id).buildQuery();
    let [activityData, err] = await catchError(Activity
        .select(['id', 'activity_type', 'created_at'])
        .with({
            'comments': (q) => {
                q.select(['post_id', 'profile_id']);
                q.withSelect('posts', ['profile_id'], (q) => {
                    q.withSelect('userProfile', ['first_name', 'last_name']);
                });
                q.withSelect('userProfile', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
            }, 'reactions': (q) => {
                q.select(['post_id', 'profile_id', 'reaction_id']);
                q.withSelect('posts', ['profile_id'], (q) => {
                    q.withSelect('userProfile', ['first_name', 'last_name']);
                });
                q.withSelect('userProfile', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
            },
            'feelpals': (q) => {
                q.select(['followers', 'followings']);
                q.withSelect('userProfileFollower', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
                q.withSelect('userProfileFollowing', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
            }
        }).where((q) => {
            q.whereHas('comments', (q) => {
                q.whereHas('userProfile', (q) => {
                    q.whereHas('usersFollowings', (q) => {
                        q.where('followers', req.params.id);
                        q.where('accepted', true);
                    })
                });
                q.whereHas('posts', (q) => {
                    q.whereNot('profile_id',req.params.id);
                });
            });
            q.orWhereHas('reactions', (q) => {
                q.whereHas('userProfile', (q) => {
                    q.whereHas('usersFollowings', (q) => {
                        q.where('followers', req.params.id);
                        q.where('accepted', true);
                    })
                });
                q.whereHas('posts', (q) => {
                    q.whereNot('profile_id',req.params.id);
                });
            });
            q.orWhereHas('feelpals', (q) => {
                q.whereIn('followers',Query.query);
                q.whereNot('followers',req.params.id);
                q.whereNot('followings',req.params.id);
                q.where('accepted',true);
            });
        })
        .orderBy('id', 'desc')
        .offset(offset)
        .limit(RECORED_PER_PAGE)
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(activityData)) {
            res.status(OK_CODE).json({auth: true, msg: "Success", count: activityData.length, data: activityData});
        } else {
            res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
        }
    }
};

module.exports = {
    'createActivity': createActivity,
    'getUserActivity': getUserActivity,
    'getAroundYouActivity': getAroundYouActivity,
};