let http = require('http');
let UserProfile = loadModal('UserProfile');
let Post = loadModal('Posts');

let getSearch = async (req , res) => {    
    let data = '';
	http.get('http://klydo.space/graph/search_for/' + req.params.query,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;            
        })

        resp.on('end', () => {
            parseData(data,res);            
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });  
}

let getAffinity = async (req , res) => {    
    let data = '';
    http.get('http://klydo.space/graph/affinity_recommender/' + req.params.query ,(resp) => {
        resp.on('data' , (chunk) => {
            data += chunk;
        })

        resp.on('end' ,() => {
            parseData(data,res);
        })
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    })
}

let getTrends = async (req, res) => {
    let data = '';
    http.get('http://klydo.space/graph/trends/',(resp) => {
        resp.on('data' , (chunk) => {
            data += chunk;
        })
        
        resp.on('end' ,() => {
            parseData(data,res);
        })
    }).on("error" ,(err) => {
        console.log("Error: " + err.message);
    })
}

let parseData = async (data,res) => {
    let finalData = JSON.parse(data);
    let peopleData = [];
    let postData = [];
    if(finalData.hasOwnProperty('people')){
        if(finalData.people.length > 0){            
            let people = finalData.people;
            let [users,err] = await catchError(UserProfile.with('userExtra').whereIn('id' , people).get());
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
            let [post,err] = await catchError(Post.with('userProfile').whereIn('id' , posts).get());
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
}

module.exports = {
    'getSearch' : getSearch,
    'getAffinity' : getAffinity,
    'getTrends' : getTrends
}