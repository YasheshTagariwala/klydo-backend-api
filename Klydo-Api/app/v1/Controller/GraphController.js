let http = require('http');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');

let getSimilarBeliefs = async (req, res) => {
    let data = '';
    let profile_id = req.body.profile_id;
    let variables = req.body.variables.join(',');
    http.get('http://owyulen.com/graph/get_similar_beliefs/' + profile_id + "_|||_" + variables, (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            parseData(data, res, req);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let updateUserWyu = async (userID, newWyuID) => {
    http.get('http://owyulen.com/graph/update_user_wyu/' + userID + '_|||_' + newWyuID.join(','), (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let extractChips = async (content, postId) => {
    let data = '';
    http.get('http://owyulen.com/graph/extract_chips/' + encodeURIComponent(content.replace('?', '.')), (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            extractedChips(data, postId);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};

let extractedChips = async (data, postId) => {
    data = JSON.parse(data);
    data = JSON.stringify(data.top_5_chips);

    let updateData = {
        'post_chips': data
    };
    if (postId) {
        let [data1, err] = await catchError(Post.where('id', postId).save(updateData, {patch: true}));
    }
};

let parseData = async (data, res, req) => {
    let finalData = JSON.parse(data);
    let peopleData = [];
    let postData = [];
    if (finalData.hasOwnProperty('people')) {
        if (finalData.people.length > 0) {
            let people = finalData.people;
            for (let i = 0; i < people.length; i++) {
                people[i] = people[i].replace("u", '');
            }
            let [users, err] = await catchError(UserProfile.with('userExtra')
                .whereIn('id', people)
                // .where((q) => {
                //     if (!isNaN(req.params.query)) {
                //         q.whereRaw('id not in (select followings from feelpals where followers = '+req.params.query+' and accepted = true and deleted_at is null)')
                //     }
                // })
                .orderByRaw('array_position(ARRAY[' + people.join(',') + ']::bigint[],id)')
                .offset(0)
                .limit(RECORED_PER_PAGE)
                .get());
            if (err) {
                console.log(err);
                return;
            } else {
                peopleData = users.toJSON();
            }
        }
    }
    if (finalData.hasOwnProperty('posts')) {
        if (finalData.posts.length > 0) {
            let posts = finalData.posts;
            for (let i = 0; i < posts.length; i++) {
                posts[i] = posts[i].replace("p", '');
            }
            let [post, err] = await catchError(Post.with({
                'userProfile': (q) => {
                    q.select(['first_name', 'last_name']);
                    q.withSelect('userExtra', ['profile_image']);
                }
            }).whereIn('id', posts)
                .orderByRaw('array_position(ARRAY[' + posts.join(',') + ']::bigint[],id)')
                .offset(0)
                .limit(RECORED_PER_PAGE)
                .get());
            if (err) {
                console.log(err);
                return;
            } else {
                postData = post.toJSON();
            }
        }
    }

    let finalPostPeopleData = {"people": peopleData, "posts": postData};
    if (Object.keys(finalPostPeopleData).length > 0) {
        res.status(OK_CODE).json({auth: true, msg: 'Data Found', data: finalPostPeopleData});
    } else {
        res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
    }
};

module.exports = {
    'getSimilarBeliefs': getSimilarBeliefs,
    'updateUserWyu': updateUserWyu,
    'extractChips': extractChips
};
