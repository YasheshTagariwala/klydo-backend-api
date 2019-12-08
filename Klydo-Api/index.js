global.APP_ROOT_PATH = __dirname;

require('dotenv').config();
require('./Config/Globals');
loadUtility('HTTPStatusCodes');
global.catchError = loadConfig('ErrorHandling');

const express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var authenticate = loadSecurity('authenticate');

app.use(fileUpload());
app.use(express.urlencoded({extended: true})); // support encoded bodies
app.use(express.json());

//TODO:'use concat in user names where neccessary'
let urls = [
    '/sandbox/v0/login/authenticate',
    '/sandbox/v0/login/signup',
    '/sandbox/v0/login/forget',
    '/sandbox/v0/login/forget-password-code',
    '/sandbox/v0/graph/trendsLogin',
    '/sandbox/v0/login/loginMedia',
    '/sandbox/v1/send-push',
    '/sandbox/v2/login/verify-email',
    '/sandbox/v2/login/verify-email/:code',
];

app.post('/sandbox/v0/login/authenticate', loadController('LoginController').loginCheck);
app.post('/sandbox/v0/login/signup', loadController('LoginController').signupUser);
app.post('/sandbox/v0/login/forget', loadController('LoginController').forgetPassword);
app.get('/sandbox/v0/login/trendsLogin', loadController('LoginController').getTrendsLogin);
app.get('/sandbox/v0/login/loginMedia/:filename', loadController('LoginController').LoginMedia);
app.post('/sandbox/v0/login/forgot-password-code', loadController('LoginController').forgetPasswordVerificationCode);
app.post('/sandbox/v1/send-push',loadV1Controller('PushNotification').sendMessagePush);
app.post('/sandbox/v2/verify-email',loadController('LoginController').verifyEmail);
app.get('/sandbox/v2/verify-email/:code',loadController('LoginController').verifyEmailCode);

//validate user before calling any routes
app.use(async (req, res, next) => {
    if (urls.includes(req.originalUrl)) {
        next();
    } else {
        let [verification, err] = await catchError(authenticate.validateToken(req.headers.token,req.headers.secret));
        if (err) {
            console.log(err);
            res.json({auth: false, msg: 'Oops! Something unexpected happened. Please try again.'});
        } else {
            if (verification.auth) {
                //All Application routes
                loadRoute('route')(app, express);
                loadV1Route('route')(app, express);
                loadV2Route('route')(app, express);
                next();
            } else {
                res.json(verification);
            }
        }

    }
});

app.listen(3200, () => {
    console.log('Listening on 3200');
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});
