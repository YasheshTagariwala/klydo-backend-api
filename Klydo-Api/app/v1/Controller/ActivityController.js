let Activity = loadModal('Activity');
let Validation = loadUtility('Validations');
let Feelpals = loadModal('Feelpals');
let bookshelf = loadConfig('Bookshelf.js');

/*
* 1. 5(nivid) bubble activity 2(yashesh)
* 2. 5 followings (Ishaan, Yashesh, Ellis) Not following (Hemin)
* 3. 5 sees activity of Yashesh doing reacts/comments on Ishaan, Ellis (No Hemin)
*       +
*    5 sees all activity done on yasehsh by 6 and all activity done on 5 by 2
*/

let getBubbleActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let Query = await Feelpals.select('followings').where('followers', req.params.user_id).buildQuery();
    let Query2 = await Feelpals.select('followings').where('followers', req.params.friend_id).buildQuery();
    // let [feelpals, err] = await catchError(bookshelf.knex.raw(Query.query + ' intersect ' + Query2.query));
    // if(err){
    //     console.log(err);
    //     res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
    //     return;
    // }else {
    //
    // }

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
            }
        }).where((q) => {
            q.whereHas('comments', (q) => {
                q.whereHas('userProfile', (q) => {
                    q.whereRaw('id in ('+Query.query + ' intersect ' + Query2.query+')');
                });
                q.whereHas('posts', (q) => {
                    q.where('profile_id', req.params.friend_id);
                });
            });
            q.orWhereHas('reactions', (q) => {
                q.whereHas('userProfile', (q) => {
                    q.whereRaw('id in ('+Query.query + ' intersect ' + Query2.query+')');
                });
                q.whereHas('posts', (q) => {
                    q.where('profile_id', req.params.friend_id);
                });
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

let addToBubble = async (req, res) => {
};

let removeFromBubble = async (req, res) => {
};

module.exports = {
    'getBubbleActivity': getBubbleActivity,
    'addToBubble' : addToBubble,
    'removeFromBubble' : removeFromBubble
};