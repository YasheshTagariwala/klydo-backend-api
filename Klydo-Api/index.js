global.APP_ROOT_PATH = __dirname;

require('./Config/paths');
require(APP_UTILITY_PATH + 'HTTPStatusCodes');
global.catchError = require(APP_CONFIG_PATH + 'ErrorHandling');

const express = require('express');
var app = express();
var authenticate = require(APP_SECURITY_PATH  + 'authenticate');
var LoginController = require(APP_CONTROLLER_PATH + 'LoginController');

app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(express.json());

TODO:'use concat in user names where neccessary'

app.post('/app/v0/login/authenticate', LoginController.loginCheck);
app.post('/app/v0/login/signup', LoginController.signupUser);
app.post('/app/v0/login/forget', LoginController.forgetPassword);
//validate user before calling any routes
app.use(async (req, res, next) => {	
	if(req.originalUrl === '/app/v0/login/authenticate' || req.originalUrl === '/app/v0/login/signup' || req.originalUrl === '/app/v0/login/forget') {
		next();			
	}else {
		// let [verification,err] = await catchError(authenticate.validateToken(req.method == "POST" ? req.body.token : req.headers.token));
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
