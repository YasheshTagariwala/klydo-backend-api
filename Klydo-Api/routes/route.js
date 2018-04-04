var UserController = require('../app/Controller/UserController');
var PostController = require('../app/Controller/PostController');

module.exports = app => {

	//all user controller routes
	app.post('/getUserDetail', UserController.getUserDetail);

	//all post controller routes
	app.post('/getAllUserPost',PostController.getAllUserPost);
	app.post('/getSinglePost',PostController.getSinglePostWithComments);
	app.post('/createPost',PostController.createPost);
	app.post('/updatePost',PostController.updatePost);
	app.post('/deletePost',PostController.deletePost);

	// Define the home page route
	app.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});
};
