const express = require('express');
var app = express();
var authenticate = require('./security/Authenticate');
var LoginController = require('./app/v1/Controller/LoginController');
let catchError = require('./Config/ErrorHandling');

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
				require('./routes/v1/route.js')(app,express);
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
