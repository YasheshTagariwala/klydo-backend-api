global.APP_ROOT_PATH = __dirname;

require('./Config/Globals');
loadUtility('HTTPStatusCodes');
global.catchError = loadConfig('ErrorHandling');

const express = require('express');
var app = express();
var fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.urlencoded({extended: true})); // support encoded bodies
app.use(express.json());

//Get middleware
var authMiddleWare = require('./app/middleware/Auth');
app.use(authMiddleWare());

app.listen(3000, () => {
    console.log('Listening on 3000');
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});
