module.exports = (app,express) => {

	let router = express.Router();	
	
	//all user controller routes
	router.get('/user/:id', loadController('UserController').getUserDetail);

	//all post controller routes
	router.get('/user/post/:id',loadController('PostController').getAllProfilePost);
	router.get('/user/post/diary/:id',loadController('PostController').getAllDiaryPost);	
	router.get('/post/:id',loadController('PostController').getSinglePostWithComments);
	router.post('/post/add',loadController('PostController').createPost);
	router.post('/post/update',loadController('PostController').updatePost);
	router.delete('/post/delete/:post',loadController('PostController').deletePost);

	//all friend controller routes
	router.post('/friend/add',loadController('FriendsController').addFriend);
	router.put('/friend/accept/:id',loadController('FriendsController').acceptFriend);
	router.delete('/friend/reject/:id',loadController('FriendsController').rejectFriend);
	router.get('/friend/follower/:id',loadController('FriendsController').getFollowers);
	router.get('/friend/following/:id',loadController('FriendsController').getFollowings);

	//all activity controlller routes
	router.get('/activity/all/:id',loadController('ActivityController').getUserActivity);

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v0', router);
	
};
