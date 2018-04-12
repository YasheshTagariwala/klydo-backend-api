var UserController = require('../../app/v1/Controller/UserController');
var PostController = require('../../app/v1/Controller/PostController');

module.exports = (app,express) => {

	let router = express.Router();
	
	//all user controller routes
	router.get('/user/:id', UserController.getUserDetail);

	//all post controller routes
	router.get('/user/post/:id',PostController.getAllUserPost);
	router.get('/post/:id',PostController.getSinglePostWithComments);
	router.post('/post/store',PostController.createPost);
	router.put('/post/update/:post',PostController.updatePost);
	router.delete('/post/delete/:post',PostController.deletePost);

	// Define the home page route
	router.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});

	app.use('/app/v1', router);
	
};
