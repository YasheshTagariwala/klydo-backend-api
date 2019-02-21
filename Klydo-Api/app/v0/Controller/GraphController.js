let http = require('http');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');

let getSearch = async (req , res) => {    
    let data = '';
	http.get('http://klydo.space/graph/search_for/' + req.params.query,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;            
        });

        resp.on('end', () => {
            parseData(data,res);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });  
};

let getTrends = async (req, res) => {
    let data = '';
    http.get('http://klydo.space/graph/get_trending_today',(resp) => {
        resp.on('data' , (chunk) => {
            data += chunk;
        });

        resp.on('end' ,() => {
            parseData(data,res);
        })
    }).on("error" ,(err) => {
        console.log("Error: " + err.message);
    })
};

let getReactionBased = async (req, res) => {
    let data = '';
    http.get('http://klydo.space/graph/get_reaction_based/' + req.params.query ,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end' ,() => {
            parseData(data,res);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let getNetworkInteractionBased = async (req, res) => {
    let data = '';
    http.get('http://klydo.space/graph/get_network_interaction_based/' + req.params.query ,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end' ,() => {
            parseData(data,res);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let getWyuRecommended = async (req, res) => {
    let data = '';
    http.get('http://klydo.space/graph/get_wyu_recommended/' + req.params.query ,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end' ,() => {
            parseData(data,res);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let getSimilarBeliefs = async (req, res) => {
    let data = '';
    http.get('http://klydo.space/graph/get_similar_beliefs/' + req.params.query ,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end' ,() => {
            parseData(data,res);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
};

let filterAndAddBeliefsFrom = async (user_id,content) => {
    http.get('http://klydo.space/graph/filter_and_add_beliefs_from/' + user_id + '_|||_' + encodeURIComponent(content) ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let addAffinity = async (doer,doee) => {
    http.get('http://klydo.space/graph/add_affinity/' + doer + ',' + doee ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let manipulateUser = async (userID,firstName,lastName,birthYear) => {
    http.get('http://klydo.space/graph/mainpulate_user/' + userID + ',' + encodeURIComponent(firstName) + ',' + encodeURIComponent(lastName) + ',' + birthYear ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let updateUserRype = async (userID,reactOne,reactTwo) => {
    http.get('http://klydo.space/graph/update_user_rype/' + userID + ',' + reactOne + '|' + reactTwo ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let updateUserWyu = async (userID,oldWyuID,newWyuID) => {
    http.get('http://klydo.space/graph/update_user_wyu/' + userID + ',' + oldWyuID + ',' + newWyuID ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let addPost = async (post_id,post_title,post_content) => {
    http.get('http://klydo.space/graph/add_post/' + post_id + '_|||_' + encodeURIComponent(post_title) + '_|||_' + encodeURIComponent(post_content) ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let deletePost = async (post_id) => {
    http.get('http://klydo.space/graph/delete_post/' + post_id ,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let updateReactWeights = async (post_id,reactionId) => {
    http.get('http://klydo.space/graph/update_react_weights/' + post_id + ',' + reactionId,(resp) => {
    }).on("error", (err) => {console.log("Error: " + err.message);})
};

let parseData = async (data,res) => {
    let finalData = JSON.parse(data);
    let peopleData = [];
    let postData = [];
    if(finalData.hasOwnProperty('people')){
        if(finalData.people.length > 0){
            let people = finalData.people;
            for(let i = 0;i < people.length; i++){
                people[i] = people[i].replace("u",'');
            }
            let [users,err] = await catchError(UserProfile.with('userExtra').whereIn('id' , people)
                .orderBy('id','desc').get());
            if(err){
                console.log(err);
                return;
            }else{
                peopleData = users.toJSON();
            }
        }
    }
    if(finalData.hasOwnProperty('posts')){
        if(finalData.posts.length > 0){
            let posts = finalData.posts;
            for(let i = 0;i < posts.length; i++){
                posts[i] = posts[i].replace("p",'');
            }
            let [post,err] = await catchError(Post.with({
                'userProfile': (q) => {
                    q.select(['first_name', 'last_name']);
                    q.withSelect('userExtra', ['profile_image']);
                }
            }).whereIn('id' , posts).orderBy('id','desc').get());
            if(err){
                console.log(err);
                return;
            }else{
                postData = post.toJSON();
            }
        }
    }

    let finalPostPeopleData = {"people" : peopleData , "posts" : postData};
    if(Object.keys(finalPostPeopleData).length > 0){
        res.status(OK_CODE).json({auth : true, msg : 'Data Found' , data : finalPostPeopleData});
    }else{
        res.status(OK_CODE).json({auth : true, msg : 'No Data Found' , data : []});
    }
};

// let getAffinity = async (req , res) => {
//     let data = '';
//     http.get('http://klydo.space/graph/affinity_recommender/' + req.params.query ,(resp) => {
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
    'getSearch' : getSearch,
    // 'getAffinity' : getAffinity,
    'getTrends' : getTrends,
    'getReactionBased' : getReactionBased,
    'getNetworkInteractionBased' : getNetworkInteractionBased,
    'getWyuRecommended' : getWyuRecommended,
    'getSimilarBeliefs' : getSimilarBeliefs,
    'filterAndAddBeliefsFrom' : filterAndAddBeliefsFrom,
    'addAffinity' : addAffinity,
    'manipulateUser' : manipulateUser,
    'updateUserRype' : updateUserRype,
    'updateUserWyu' : updateUserWyu,
    'addPost' : addPost,
    'deletePost' : deletePost,
    'updateReactWeights' : updateReactWeights,
};
