let Activity = loadV1Modal('Activity');
let Validation = loadUtility('Validations');
let Feelpals = loadModal('Feelpals');

/*
* 1. 5(nivid) bubble activity 2(yashesh)
* 2. 5 followings (Ishaan, Yashesh, Ellis) Not following (Hemin)
* 3. 5 sees activity of Yashesh doing reacts/comments on Ishaan, Ellis (No Hemin)
*       +
*    5 sees all activity done on yasehsh by 6 and all activity done on 5 by 2
*/

let ActivityTypes = {
    '1': 'Add Post',
    '2': 'Add Friend',
    '3': 'Add Comment',
    '4': 'Add Reaction',
    '5': 'Add Slam Reply',
    '6': 'Add/Update Kly-Web Data',
    '7': 'Add/Update User Profile',
    '8': 'Add/Update Status'
};

let updateActivityId = async (activityType, id) => {

    let activityId = {
        'activity_type': activityType
    };

    let [update, err] = await catchError(Activity.where('id', id)
        .save(activityId, {patch: true}));

    if (err)
        return null;
    else
        return id;
};

let getBubbleActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let Query = await Feelpals.select('followings').where('followers', req.params.user_id).buildQuery();
    let Query2 = await Feelpals.select('followings').where('followers', req.params.friend_id).buildQuery();
    let Query3 = await Feelpals.select('followers').where('followings', req.params.user_id).buildQuery();
    let Query4 = await Feelpals.select('followers').where('followings', req.params.friend_id).buildQuery();

    let [activityData, err] = await catchError(Activity
        .select(['id', 'activity_type', 'updated_at'])
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
            }, 'userProfile': (q) => {
                q.select(['id','about_me','first_name','last_name']);
                q.withSelect('userExtra', ['profile_image']);
            }, 'userExtra': (q) => {
                q.select(['profile_image','user_profile_id']);
                q.withSelect('userProfile', ['first_name', 'last_name']);
            }, 'klyspaceData': (q) => {
                q.withSelect('doerUserProfile', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
                q.withSelect('doeeUserProfile', ['first_name', 'last_name'],(q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
            }
        }).where((q) => {
            q.where((q) => {
                q.whereHas('comments', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.where('id', req.params.user_id);
                    });
                    q.whereHas('posts', (q) => {
                        q.where('profile_id', req.params.friend_id);
                    });
                });
                q.orWhereHas('comments', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                    q.whereHas('posts', (q) => {
                        q.where('profile_id', req.params.user_id);
                    });
                });
                q.orWhereHas('comments', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                    q.whereHas('posts', (q) => {
                        q.whereRaw('profile_id in (' + Query.query + ' intersect ' + Query2.query + ')');
                    });
                });
                q.orWhereHas('comments', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.whereRaw('id in (' + Query3.query + ' intersect ' + Query4.query + ')');
                    });
                    q.whereHas('posts', (q) => {
                        q.where('profile_id', req.params.friend_id);
                    });
                });
            });
            q.orWhere((q) => {
                q.whereHas('reactions', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.where('id', req.params.user_id);
                    });
                    q.whereHas('posts', (q) => {
                        q.where('profile_id', req.params.friend_id);
                    });
                });
                q.orWhereHas('reactions', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                    q.whereHas('posts', (q) => {
                        q.where('profile_id', req.params.user_id);
                    });
                });
                q.orWhereHas('reactions', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                    q.whereHas('posts', (q) => {
                        q.whereRaw('profile_id in (' + Query.query + ' intersect ' + Query2.query + ')');
                    });
                });
                q.orWhereHas('reactions', (q) => {
                    q.whereHas('userProfile', (q) => {
                        q.whereRaw('id in (' + Query3.query + ' intersect ' + Query4.query + ')');
                    });
                    q.whereHas('posts', (q) => {
                        q.where('profile_id', req.params.friend_id);
                    });
                });
            });
            q.orWhere((q) => {
                q.orWhereHas('userProfile', (q) => {
                    q.where('id', req.params.friend_id);
                });
            });
            q.orWhere((q) => {
                q.orWhereHas('userExtra', (q) => {
                    q.where('user_profile_id', req.params.friend_id);
                });
            });
            q.orWhere((q) => {
                q.whereHas('klyspaceData', (q) => {
                    q.whereHas('doerUserProfile', (q) => {
                        q.where('id', req.params.user_id);
                    });
                    q.whereHas('doeeUserProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                });
                q.orWhereHas('klyspaceData', (q) => {
                    q.whereHas('doerUserProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                    q.whereHas('doeeUserProfile', (q) => {
                        q.where('id', req.params.user_id);
                    });
                });
                q.orWhereHas('klyspaceData', (q) => {
                    q.whereHas('doerUserProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                    q.whereHas('doeeUserProfile', (q) => {
                        q.whereRaw('id in (' + Query.query + ' intersect ' + Query2.query + ')');
                    });
                });
                q.orWhereHas('klyspaceData', (q) => {
                    q.whereHas('doerUserProfile', (q) => {
                        q.whereRaw('id in (' + Query3.query + ' intersect ' + Query4.query + ')');
                    });
                    q.whereHas('doeeUserProfile', (q) => {
                        q.where('id', req.params.friend_id);
                    });
                });
            });
        })
        .orderBy('updated_at', 'desc')
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

let getAroundYouActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let Query = await Feelpals.select('followers').where('followings',req.params.id).buildQuery();
    let [activityData, err] = await catchError(Activity
        .select(['id', 'activity_type', 'updated_at'])
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
            },
            'userProfile':(q) => {
                q.select(['id','about_me','first_name','last_name']);
                q.withSelect('userExtra', ['profile_image']);
            },
            'userExtra':(q) => {
                q.select(['profile_image','user_profile_id']);
                q.withSelect('userProfile', ['first_name', 'last_name']);
            },
            'klyspaceData': (q) => {
                q.withSelect('doerUserProfile', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
                q.withSelect('doeeUserProfile', ['first_name', 'last_name'],(q) => {
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
            q.orWhereHas('userProfile', (q) => {
                q.whereHas('usersFollowings', (q) => {
                    q.where('followers', req.params.id);
                    q.where('accepted', true);
                });
            });
            q.orWhereHas('userExtra', (q) => {
                q.whereHas('userProfile', (q) => {
                    q.whereHas('usersFollowings', (q) => {
                        q.where('followers', req.params.id);
                        q.where('accepted', true);
                    });
                });
            });
            q.orWhereHas('klyspaceData', (q) => {
                q.whereHas('doerUserProfile' ,(q) => {
                    q.whereHas('usersFollowings', (q) => {
                        q.where('followers', req.params.id);
                        q.where('accepted', true);
                    });
                });
            })
        })
        .orderBy('updated_at', 'desc')
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

let getUserActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let [activityData, err] = await catchError(Activity
        .select(['id', 'activity_type', 'updated_at'])
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
            },
            'klyspaceData': (q) => {
                q.withSelect('doerUserProfile', ['first_name', 'last_name'], (q) => {
                    q.withSelect('userExtra', ['profile_image', 'emotion'])
                });
                q.withSelect('doeeUserProfile', ['first_name', 'last_name'],(q) => {
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
            q.orWhereHas('klyspaceData', (q) => {
                q.where('doee_profile_id', req.params.id);
            });
        })
        .orderBy('updated_at', 'desc')
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

module.exports = {
    'getBubbleActivity': getBubbleActivity,
    'updateActivityId': updateActivityId,
    'getAroundYouActivity': getAroundYouActivity,
    'getUserActivity': getUserActivity
};