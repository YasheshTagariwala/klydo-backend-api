var UserController = require('../app/Controller/UserController');

module.exports = function(app) {

	//all user controller routes
	app.get('/getAllUsers', UserController.getAllUsers);
	app.get('/getlogin', UserController.getLoginVerify);

	// Define the home page route
	app.get('/', function(req, res) {
		res.send('Write whole URL you lazy ass.');
	});
};
