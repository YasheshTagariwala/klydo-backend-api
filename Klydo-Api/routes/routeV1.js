var UserController = require('../appV1/Controller/UserController');
var PostController = require('../appV1/Controller/PostController');

module.exports = app => {

	//all user controller routes
	app.get('/app/v1/user/:id', UserController.getUserDetail);

	//all post controller routes
	app.get('/app/v1/user/post/:id',PostController.getAllUserPost);
	app.get('/app/v1/post/:id',PostController.getSinglePostWithComments);
	app.post('/app/v1/post/store',PostController.createPost);
	app.put('/app/v1/post/update/:post',PostController.updatePost);
	app.delete('/app/v1/post/delete/:post',PostController.deletePost);

	// Define the home page route
	app.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});
};
