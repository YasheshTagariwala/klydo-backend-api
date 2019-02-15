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
	router.get('/post/comment/:id',loadController('PostController').getPostComments);
	router.get('/post/filter/:id/:reaction_id',loadController('PostController').filterProfilePost);
	router.get('/user/post/:id',loadController('PostController').getAllProfilePost);

	//get user profile
    router.get('/user/:id/:friend_id?', loadController('UserController').getUserDetail);
    //
	router.get('/user/post/diary/:id',loadController('PostController').getAllDiaryPost);	
	router.get('/post/:id',loadController('PostController').getSinglePostWithComments);
	router.post('/post/add',loadController('PostController').createPost);
	router.post('/post/update',loadController('PostController').updatePost);
	router.delete('/post/delete/:post',loadController('PostController').deletePost);

	//all friend controller routes	
	router.post('/friend/add',loadController('FriendsController').addFriend);
	router.post('/friend/post/:id',loadController('FriendsController').getAllProfilePost);
	router.put('/friend/accept/:id',loadController('FriendsController').acceptFriend);
	router.delete('/friend/reject/:id',loadController('FriendsController').rejectFriend);
	router.get('/friend/follower/:id/:friend_id?/',loadController('FriendsController').getFollowers);
	router.get('/friend/following/:id/:friend_id?/',loadController('FriendsController').getFollowings);
	router.get('/friend/:id/:user_id',loadController('FriendsController').getFriendDetail);

	//all activity controlller routes
	router.get('/activity/all/:id',loadController('ActivityController').getUserActivity);

	//send media file
	router.get('/media/:filename',(req, res) => {		
		res.sendFile(MediaPath + '/' + req.params.filename);
	});

	//all graph controller routes
	router.get('/graph/search/:query',loadController('GraphController').getSearch);
	router.get('/graph/affinity/:query',loadController('GraphController').getAffinity);
	router.get('/graph/trends',loadController('GraphController').getTrends);

	//all klyspace controller routes
	router.get('/klyspace/variable',loadController('KlyspaceController').getAllKlyspaceVariables);
	router.post('/klyspace/add/variable',loadController('KlyspaceController').addNewKlyspaceName);
	router.post('/klyspace/update/variable/status',loadController('KlyspaceController').updateKlyspaceStatus);
	router.post('/klyspace/update/variable/name',loadController('KlyspaceController').updateKlyspaceName);
	router.post('/klyspace-data/add',loadController('KlyspaceController').addKlyspaceData);

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v0', router);
	
};
