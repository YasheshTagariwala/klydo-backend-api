var UserController = require('../app/Controller/UserController');

module.exports = function(app) {

	//all user controller routes
	app.get('/getAllUsers', UserController.getAllUsers);
	app.get('/getlogin', UserController.getLoginVerify);
	app.post('/loginCheck', UserController.loginCheck);
	app.post('/checkToken', UserController.checkToken);

	// Define the home page route
	app.get('/', function(req, res) {
		res.send('Write the whole URL you lazy ass.');
	});
};
