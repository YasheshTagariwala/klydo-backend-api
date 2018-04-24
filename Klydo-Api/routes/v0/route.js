var UserController = require(APP_CONTROLLER_PATH + 'UserController');
var PostController = require(APP_CONTROLLER_PATH + 'PostController');
var FriendController = require(APP_CONTROLLER_PATH + 'FriendsController');
var ActivityController = require(APP_CONTROLLER_PATH + 'ActivityController');

module.exports = (app,express) => {

	let router = express.Router();
	
	//all user controller routes
	router.get('/user/:id', UserController.getUserDetail);

	//all post controller routes
	router.get('/user/post/:id',PostController.getAllProfilePost);
	router.get('/user/post/diary/:id',PostController.getAllDiaryPost);	
	router.get('/post/:id',PostController.getSinglePostWithComments);
	router.post('/post/add',PostController.createPost);
	router.post('/post/update',PostController.updatePost);
	router.delete('/post/delete/:post',PostController.deletePost);

	//all friend controller routes
	router.post('/friend/add',FriendController.addFriend);
	router.put('/friend/accept/:id',FriendController.acceptFriend);
	router.delete('/friend/reject/:id',FriendController.rejectFriend);
	router.get('/friend/followers/:id',FriendController.getFollowers);
	router.get('/friend/followings/:id',FriendController.getFollowings);

	//all activity controlller routes
	router.get('/activity/all/:id',ActivityController.getUserActivity);

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v0', router);
	
};
