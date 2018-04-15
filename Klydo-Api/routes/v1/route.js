var UserController = require('../../app/v1/Controller/UserController');
var PostController = require('../../app/v1/Controller/PostController');
var FriendController = require('../../app/v1/Controller/FriendsController');

module.exports = (app,express) => {

	let router = express.Router();
	
	//all user controller routes
	router.get('/user/:id', UserController.getUserDetail);

	//all post controller routes
	router.get('/user/post/:id',PostController.getAllProfilePost);
	router.get('/user/post/diary/:id',PostController.getAllDiaryPost);	
	router.get('/post/:id',PostController.getSinglePostWithComments);
	router.post('/post/add',PostController.createPost);
	router.put('/post/update/:post',PostController.updatePost);
	router.delete('/post/delete/:post',PostController.deletePost);

	//all friend controller routes
	router.post('/friend/add',FriendController.addFriend);

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v1', router);
	
};
