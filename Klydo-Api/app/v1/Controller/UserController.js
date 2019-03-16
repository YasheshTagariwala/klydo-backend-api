let UserProfile = loadModal('UserProfile');
let Reaction = loadModal('PostReaction');
let KlyspaceData = loadModal('KlyspaceData');
let Klyspace = loadModal('Klyspace');
let bookshelf = loadConfig('Bookshelf.js');

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
            users = users.toJSON();
            users.reaction = reaction;
            users.klyspaceData = null;
            let [klySpaceData, err1] = await catchError(KlyspaceData.select('klyspace_data')
                .where('doee_profile_id', req.params.id)
                .whereNot('doer_profile_id', req.params.id)
                .get());
            if(klySpaceData){
                klySpaceData = klySpaceData.toJSON();

                let [variables, err2] = await catchError(Klyspace.select(['id'])
                    .where('status', true)
                    .orderBy('id', 'asc')
                    .get());

                variables = variables.toJSON();

                let vector = [];
                for (let i = 0; i < variables.length; i++) {
                    let tempData = klySpaceData.filter((obj) => {
                        return obj.klyspace_data.indexOf((+variables[i].id)) > -1
                    });

                    let countData = {
                        'klyspace_id': variables[i].id,
                        'count': tempData.length
                    };
                    vector.push(countData);
                }

                vector.sort(SortByID);
                vector = vector.splice(0, 8);

                users.klyspaceData = vector;
            }
        }
        res.status(OK_CODE).json({auth: true, msg: 'Success', data: users});
    }
};

function SortByID(x, y) {
    return y.count - x.count;
}

module.exports = {
    'getUserDetail': getUserDetail,
};
