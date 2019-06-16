module.exports = (app,express) => {
    var authenticate = loadSecurity('authenticate');

    let urls = [
        '/app/v0/login/authenticate',
        '/app/v0/login/signup',
        '/app/v0/login/forget',
        '/app/v0/login/forget-password-code',
        '/app/v0/graph/trendsLogin',
        '/app/v0/login/loginMedia',
        '/app/v1/send-push'
    ];

    app.post('/app/v0/login/authenticate', loadController('LoginController').loginCheck);
    app.post('/app/v0/login/signup', loadController('LoginController').signupUser);
    app.post('/app/v0/login/forget', loadController('LoginController').forgetPassword);
    app.get('/app/v0/login/trendsLogin', loadController('LoginController').getTrendsLogin);
    app.get('/app/v0/login/loginMedia/:filename', loadController('LoginController').LoginMedia);
    app.post('/app/v0/login/forgot-password-code', loadController('LoginController').forgetPasswordVerificationCode);
    app.post('/app/v1/send-push', loadV1Controller('PushNotification').sendMessagePush);

    //validate user before calling any routes
    return async (req, res, next) => {
        if (urls.includes(req.originalUrl)) {
            next();
        } else {
            // let [verification, err] = await catchError(authenticate.validateToken(req.headers.token,req.headers.secret));
            // if(err) {
            // 	console.log(err);
            // 	res.json({auth: false, msg:'Oops! Something unexpected happened. Please try again.'});
            // } else {
            // 	if(verification.auth) {
            // 		//All Application routes
            loadRoute('route')(app, express);
            loadV1Route('route')(app, express);
            next();
            // } else {
            // 	res.json(verification);
            // }
            // }

        }
    }
};