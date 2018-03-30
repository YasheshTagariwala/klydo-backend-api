var UserController = require('../app/Controller/UserController');
var PostController = require('../app/Controller/PostController');

module.exports = app => {

	//all user controller routes
	app.get('/getAllUsers', UserController.getAllUsers);
	app.get('/getlogin', UserController.getLoginVerify);
	app.post('/validate', UserController.validateMe);


	//all post controller routes
	app.post('/getAllUserPost',PostController.getAllUserPost);

	// Define the home page route
	app.get('/', (req, res) => {
		res.send('Write the whole URL you lazy ass.');
	});
};
