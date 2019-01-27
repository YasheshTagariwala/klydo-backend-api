module.exports = (app,express) => {

	let router = express.Router();	
	
	//all user controller routes
	router.get('/user/:id', loadController('UserController').getUserDetail);
	router.post('/user/update-profile',loadController('UserController').updateProfile);
	router.post('/user/change-profile-privacy',loadController('UserController').changeProfilePrivacy);
	router.post('/user/change-password',loadController('UserController').changePassword);

	//all post controller routes
	router.get('/user/post/home/:id',loadController('PostController').getAllHomePost);
	router.get('/user/post/:id',loadController('PostController').getAllProfilePost);
	router.get('/user/post/diary/:id',loadController('PostController').getAllDiaryPost);	
	router.get('/post/:id',loadController('PostController').getSinglePostWithComments);
	router.post('/post/add',loadController('PostController').createPost);
	router.post('/post/update',loadController('PostController').updatePost);
	router.delete('/post/delete/:post',loadController('PostController').deletePost);

	//all friend controller routes
	router.get('/friend/:id/:user_id',loadController('FriendsController').getFriendDetail);
	router.post('/friend/add',loadController('FriendsController').addFriend);
	router.put('/friend/accept/:id',loadController('FriendsController').acceptFriend);
	router.delete('/friend/reject/:id',loadController('FriendsController').rejectFriend);
	router.get('/friend/follower/:id/:friend_id',loadController('FriendsController').getFollowers);
	router.get('/friend/following/:id/:friend_id',loadController('FriendsController').getFollowings);

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

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v0', router);
	
};
