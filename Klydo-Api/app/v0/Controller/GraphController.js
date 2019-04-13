let http = require('http');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');
// let host = "owyulen.com";
let host = "localhost:5000";

let getSearch = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/search_for/' + req.params.query.replace("?", "."), (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            parseData(data, res, req);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
};

let getTrends = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/get_trending_today', (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            parseData(data, res, req);
        })
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let getReactionBased = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/get_reaction_based/' + req.params.query.replace("?", "."), (resp) => {
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

let getNetworkInteractionBased = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/get_network_interaction_based/' + req.params.query.replace("?", "."), (resp) => {
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

let getWyuRecommended = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/get_wyu_recommended/' + req.params.query.replace("?", "."), (resp) => {
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

let getSimilarBeliefs = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/get_similar_beliefs/' + req.params.query.replace("?", "."), (resp) => {
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

let filterAndAddBeliefsFrom = async (user_id, content) => {
    http.get('http://'+ host +'/filter_and_add_beliefs_from/' + user_id + '_|||_' + encodeURIComponent(content.replace("?", ".")), (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let addAffinity = async (doer, doee) => {
    http.get('http://'+ host +'/add_affinity/' + doer + ',' + doee, (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let manipulateUser = async (userID, firstName, lastName, birthYear) => {
    http.get('http://'+ host +'/mainpulate_user/' + userID + ',' + encodeURIComponent(firstName.replace("?", ".")) + ',' + encodeURIComponent(lastName.replace("?", ".")) + ',' + birthYear, (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let updateUserRype = async (userID, reactOne, reactTwo) => {
    http.get('http://'+ host +'/update_user_rype/' + userID + ',' + reactOne + '|' + reactTwo, (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let updateUserWyu = async (userID, oldWyuID, newWyuID) => {
    http.get('http://'+ host +'/update_user_wyu/' + userID + ',' + oldWyuID + ',' + newWyuID, (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let addPost = async (post_id, post_title, post_content) => {
    http.get('http://'+ host +'/add_post/' + post_id + '_|||_' + encodeURIComponent(post_title.replace("?", ".")) + '_|||_' + encodeURIComponent(post_content.replace("?", ".")), (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let deletePost = async (post_id) => {
    http.get('http://'+ host +'/delete_post/' + post_id, (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let updateReactWeights = async (post_id, reactionId) => {
    http.get('http://'+ host +'/update_react_weights/' + post_id + ',' + reactionId, (resp) => {
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let trackUser = async (req, res) => {
    let data = '';
    http.get('http://'+ host +'/track_add/' + req.params.query.replace("?", "."), (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            res.status(OK_CODE).json({auth: true, msg: 'Tracked'});
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

//Ishaan API
let getBeliefsAndViews = async (req, res) => {
    let beliefsAndViews = '';
    http.get('http://'+ host +'/get_views_and_beliefs/' + req.params.userID, (q) => {
        q.on('data', (akjcnawkjnc) => {
            beliefsAndViews += akjcnawkjnc;
        });

        q.on('end', () => {
            parseBeliefsAndViews(beliefsAndViews, res, req);
        })
    })
};

let getReactFilteredPosts = async (req, res) => {
    let reactFilteredPosts = '';
    http.get('http://'+ host +'/get_reaction_based/' + req.params.reaction_id, (q) => {
        q.on('data', (fuckyoumarkzuckmydick) => {
            reactFilteredPosts += fuckyoumarkzuckmydick;
        });

        q.on('end', () => {
            parseData(reactFilteredPosts, res, req);
        })
    })
};

let parseBeliefsAndViews = async (data, res, req) => {
    let finalData = JSON.parse(data);
    let beliefs = [];
    let views = [];

    if (finalData.hasOwnProperty("beliefs")) {
        if (finalData.beliefs.length > 0) {
            let bf = finalData.beliefs;
            for (let i = 0;i < bf.length; i++){
                beliefs.push(bf[i]);
            }
        }
    }

    if (finalData.hasOwnProperty("views")) {
        if (finalData.views.length > 0) {
            let vs = finalData.views;
            for (let i = 0;i < vs.length; i++){
                views.push(vs[i]);
            }
        }
    }

    let finalBeliefsAndViewData = {"beliefs": beliefs, "views": views};
    if (Object.keys(finalBeliefsAndViewData).length > 0) {
        res.status(OK_CODE).json({auth: true, msg: 'Data Found', data: finalBeliefsAndViewData});
    } else {
        res.status(OK_CODE).json({auth: true, msg: 'No Data Found', data: []});
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

// let getAffinity = async (req , res) => {
//     let data = '';
//     http.get('http://'+ host +'/affinity_recommender/' + req.params.query ,(resp) => {
//         resp.on('data' , (chunk) => {
//             data += chunk;
//         });
//
//         resp.on('end' ,() => {
//             parseData(data,res);
//         })
//     }).on("error", (err) => {
//         console.log("Error: " + err.message);
//     })
// };

module.exports = {
    'getSearch': getSearch,
    // 'getAffinity' : getAffinity,
    'getTrends': getTrends,
    'getReactionBased': getReactionBased,
    'getNetworkInteractionBased': getNetworkInteractionBased,
    'getWyuRecommended': getWyuRecommended,
    'getSimilarBeliefs': getSimilarBeliefs,
    'filterAndAddBeliefsFrom': filterAndAddBeliefsFrom,
    'addAffinity': addAffinity,
    'manipulateUser': manipulateUser,
    'updateUserRype': updateUserRype,
    'updateUserWyu': updateUserWyu,
    'addPost': addPost,
    'deletePost': deletePost,
    'updateReactWeights': updateReactWeights,
    'trackUser': trackUser,
    'getBeliefsAndViews' : getBeliefsAndViews,
    'getReactFilteredPosts' : getReactFilteredPosts
};
