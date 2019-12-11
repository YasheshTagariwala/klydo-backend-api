let ProfileReport = loadV2Modal('ProfileReport');
const bookshelf = loadConfig('Bookshelf.js');
const UserProfile = loadModal('UserProfile');
let FeelPals = loadModal('Feelpals');
let Posts = loadModal('Posts');
let KlyspaceData = loadModal('KlyspaceData');
let Reaction = loadModal('PostReaction');

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
            q.with('reactions', (q) => {
                q.select(['reaction_id',bookshelf.knex.raw('count(*) as count')]);
                q.query((q) => {
                    q.groupBy('reaction_id');
                    q.groupBy('post_id')
                });
                q.orderBy('count','desc');
            });
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
            .select(['id','post_chips'])
            .where('profile_id',req.params.id)
            .get());

        var [friendcount,err4] = await catchError(FeelPals
            .where('followings',req.params.id)
            .count());

        var [reactioncount,err5] = await catchError(Reaction
            .whereHas('posts',(q) => {
                q.where('profile_id',req.params.id)
            })
            .count());

        postcount = postcount.toJSON();
        let chips = [];
        for (let i = 0; i < postcount.length; i++) {
            if (postcount[i].post_chips && postcount[i].post_chips.length) {
                chips = [...chips, ...postcount[i].post_chips];
            }
        }
        let counts = {};
        let countArray = [];
        chips.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
        for(let a in counts){
            countArray.push([a,counts[a]])
        }
        countArray.sort((a, b) => { return b[1] - a[1]});
        countArray = countArray.splice(0,5);
        let top5Chips = [];
        countArray.forEach((value) => {
           top5Chips.push(value[0]);
        });

        users = users.toJSON();
        users.reaction = reaction;
        users.klyspaceData = klyspaceData;
        users.klyspacecount = klyspaceData.toJSON().length;
        users.postcount = postcount.length;
        users.friendcount = friendcount;
        users.reactioncount = reactioncount;
        users.top5Chips = top5Chips;
    }

    res.status(OK_CODE).json({auth: true, msg: 'Success', data: users});
};

let reportProfile = async (req, res) => {

    if (!req.body.user_id || !req.body.report_id) {
        res.status(OK_CODE).json({auth: true, msg: "Missing Parameters"});
        return ;
    }

    let [profile, err] = await catchError(ProfileReport.where({profile_id: req.body.user_id,report_profile_id: req.body.report_id}).first());

    if (profile) {
        res.status(OK_CODE).json({auth: true, msg: "You Already Reported This Profile"});
    } else {
        let report = {
            profile_id: req.body.user_id,
            report_profile_id: req.body.report_id,
            reason: req.body.reason
        };

        let [data, err] = await catchError(ProfileReport.forge(report).save());

        if (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        } else {
            res.status(OK_CODE).json({auth: true, msg: "Profile Reported Successfully"});
        }
    }
};

module.exports = {
    'getUserDetail': getUserDetail,
    'reportProfile': reportProfile
};
