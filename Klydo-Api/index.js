global.APP_ROOT_PATH = __dirname;

require('./Config/paths');
require(APP_UTILITY_PATH + 'HTTPStatusCodes');
global.catchError = require(APP_CONFIG_PATH + 'ErrorHandling');

const express = require('express');
var app = express();
var authenticate = require(APP_SECURITY_PATH  + 'Authenticate');
var LoginController = require(APP_CONTROLLER_PATH + 'LoginController');

app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(express.json());

app.post('/login/authenticate', LoginController.loginCheck);
//validate user before calling any routes
app.use(async (req, res, next) => {
	if(req.originalUrl === '/login/authenticate') {
	next();
	} else {
		// let [verification,err] = await catchError(authenticate.validateToken(req.body.token));
		// if(err) {
		// 	console.log(err);
		// 	res.json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
		// } else {
		// 	if(verification.auth) {
		// 		//All Application routes
				require(APP_ROUTES_PATH + 'route')(app,express);
				next();
		// 	} else {
		// 		res.json(verification);
		// 	}
		// }

	}
});

app.listen(3000, () => {
	console.log('Listening on 3000');
});
