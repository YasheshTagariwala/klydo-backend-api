let UserProfile = loadModal('UserProfile');
let FeelPals = loadModal('Feelpals');
let Posts = loadModal('Posts');
let KlyspaceData = loadModal('KlyspaceData');
let Reaction = loadModal('PostReaction');
const bookshelf = loadConfig('Bookshelf.js');

//Get single User details
let getUserDetail = async (req, res) => {
    var [users,err] = await catchError(UserProfile.select(['id', 'first_name', 'middle_name', 'last_name','about_me'])
        .withSelect('userExtra', ['id', 'profile_privacy', 'profile_image'])
        .withSelect('posts', ['profile_id', 'id', 'post_content', 'post_title', 'post_media'], (q) => {
            q.with({'userProfile': (q) => {
                    q.select(['first_name', 'last_name']);
                    q.withSelect('userExtra', ['profile_image']);
                }
            });
            q.withCount('reactions');
            q.withCount('comments');
            q.where({'profile_id': req.params.id});
            q.query((q) => {
                q.orderBy('reactionsCount', 'desc')
            });
            q.offset(0);
            q.limit(10);
            if (req.params.friend_id) {
                q.withSelect('reaction', ['reaction_id', 'profile_id'], (q) => {
                    q.where('profile_id', req.params.friend_id);
                })
            }
        })
        .withSelect('usersFollowings',['id','followings','followers','is_favourite'] ,(q) => {
            q.with({'userProfileFollower': (q) => {
                    q.select(['first_name', 'last_name']);
                    q.withSelect('userExtra', ['profile_image']);
                }
            });
            q.where({'is_favourite': true});
            q.orderBy('id', 'desc');
            q.offset(0);
            q.limit(6);
        })
        .with('userFollowings', (q) => {
            if (req.params.friend_id) {
                q.select(['id', 'followers', 'accepted', 'is_favourite']);
                q.where('followers', req.params.friend_id);
            }
        })
        .where({'id': req.params.id}).first());

    let [reaction,err1] = await catchError(Reaction.select(['reaction_id', bookshelf.knex.raw('count(*) as count')]).whereHas('posts', (q) => {
        q.where('profile_id', req.params.id);
    }).orderBy('count', 'desc')
        .query((q) => {
            q.groupBy('reaction_id');
            // q.offset(0);
            // q.limit(2);
        })
        .get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        var [klyspaceData,err2] = await catchError(KlyspaceData
            .where('doee_profile_id',req.params.id)
            .get());

        var [postcount,err3] = await catchError(Posts
            .where('profile_id',req.params.id)
            .get().count());

        var [friendcount,err4] = await catchError(FeelPals
            .where('following',req.params.id)
            .get().count());

        var [reactioncount,err5] = await catchError(Reaction
            .whereHas('posts',(q) => {
                q.where('profile_id',req.params.id)
            })
            .get().count());

        users = users.toJSON();
        users.reaction = reaction;
        users.klyspaceData = klyspaceData;
        users.klyspacecount = klyspaceData.toJSON().length;
        users.postcount = postcount;
        users.friendcount = friendcount;
        users.reactioncount = reactioncount;
    }

    res.status(OK_CODE).json({auth: true, msg: 'Success', data: users});
};

module.exports = {
    'getUserDetail': getUserDetail
};
