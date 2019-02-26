module.exports = (app,express) => {

	let router = express.Router();	
	
	//all user controller routes
	router.post('/user/update-profile',loadController('UserController').updateProfile);
	router.post('/user/change-profile-privacy',loadController('UserController').changeProfilePrivacy);
	router.post('/user/change-password',loadController('UserController').changePassword);
	router.post('/user/change-status',loadController('UserController').changeStatus);
	router.post('/user/change-profile-image',loadController('UserController').updateProfileImage);

	//Post Comment Routes
    router.post('/post/add-comment',loadController('PostController').addComment);
    router.post('/post/add-reaction',loadController('PostController').addReaction);
    router.get('/post/reaction/:id',loadController('PostController').getPostReactions);

    //all post controller routes
    router.get('/user/post/home/:id',loadController('PostController').getAllHomePost);
    router.get('/user/post/:id/:friend_id',loadController('PostController').getAllProfilePost);
    router.get('/post/comment/:id',loadController('PostController').getPostComments);
    router.get('/post/comment/delete/:id',loadController('PostController').deleteComment);
    router.get('/post/filter/:id/:reaction_id',loadController('PostController').filterProfilePost);

	//get user profile
    router.get('/user/:id/:friend_id?', loadController('UserController').getUserDetail);
    //
	router.get('/user/post/diary/:id',loadController('PostController').getAllDiaryPost);
    router.get('/post/delete/:post',loadController('PostController').deletePost);
    router.get('/post/:id/:user_id?',loadController('PostController').getSinglePostWithComments);
    router.post('/post/add',loadController('PostController').createPost);
    router.post('/post/update',loadController('PostController').updatePost);

	//all friend controller routes	
	router.post('/friend/add',loadController('FriendsController').addFriend);
	router.get('/friend/pending/:id',loadController('FriendsController').getPendingFriendRequests);
	router.get('/friend/accept/:id',loadController('FriendsController').acceptFriend);
	router.get('/friend/reject/:id',loadController('FriendsController').rejectFriend);
	router.get('/friend/follower/:id/:friend_id?/',loadController('FriendsController').getFollowers);
	router.get('/friend/following/:id/:friend_id?/',loadController('FriendsController').getFollowings);
	router.get('/friend/:id/:user_id',loadController('FriendsController').getFriendDetail);

	//all activity controlller routes
	router.get('/activity/all/:id',loadController('ActivityController').getUserActivity);
	router.get('/activity/around/:id',loadController('ActivityController').getAroundYouActivity);

	//send media file
	router.get('/media/:filename',(req, res) => {
	    let fs = require('fs');
        if(fs.existsSync(MediaPath + '/' + req.params.filename)){
            res.sendFile(MediaPath + '/' + req.params.filename);
        }
	});

	//all graph controller routes
	router.get('/graph/search/:query',loadController('GraphController').getSearch);
	// router.get('/graph/affinity/:query',loadController('GraphController').getAffinity);
    router.get('/graph/trends',loadController('GraphController').getTrends);
	router.get('/graph/similar/:query',loadController('GraphController').getSimilarBeliefs);
	router.get('/graph/beyond/:query',loadController('GraphController').getNetworkInteractionBased);

	//all klyspace controller routes
	router.get('/klyspace/variable',loadController('KlyspaceController').getAllKlyspaceVariables);
	router.post('/klyspace/add/variable',loadController('KlyspaceController').addNewKlyspaceName);
	router.post('/klyspace/update/variable/status',loadController('KlyspaceController').updateKlyspaceStatus);
	router.post('/klyspace/update/variable/name',loadController('KlyspaceController').updateKlyspaceName);
	router.post('/klyspace-data/add',loadController('KlyspaceController').addKlyspaceData);

	//track API
	router.get('/graph/track/:query',loadController('GraphController').trackUser);

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v0', router);
	
};
