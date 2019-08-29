let v0Paths = APP_ROOT_PATH + '/app/v0/';
let v1Paths = APP_ROOT_PATH + '/app/v1/';
let v2Paths = APP_ROOT_PATH + '/app/v2/';
let v0RoutePaths = APP_ROOT_PATH + '/routes/';
let v1RoutePaths = APP_ROOT_PATH + '/routes/';
let v2RoutePaths = APP_ROOT_PATH + '/routes/';

//v0 Paths
let APP_MODEL_PATH = v0Paths + 'Models/';
let APP_CONTROLLER_PATH = v0Paths + 'Controller/';
let APP_UTILITY_PATH = v0Paths + 'Utility/';

//v1 Paths
let APP_V1_CONTROLLER_PATH = v1Paths + 'Controller/';
let APP_V1_MODEL_PATH = v1Paths + 'Models/';
//security paths
let APP_SECURITY_PATH = APP_ROOT_PATH + '/security/';

//config paths
let APP_CONFIG_PATH = APP_ROOT_PATH + '/Config/';

//v0 route paths
let APP_ROUTES_PATH = v0RoutePaths + 'v0/';

//v1 route paths
let APP_V1_ROUTES_PATH = v1RoutePaths + 'v1/';

let APP_V2_CONTROLLER_PATH = v2Paths + 'Controller/';
let APP_V2_ROUTES_PATH = v2RoutePaths + 'v2/';

let APP_MEDIA_PATH = APP_ROOT_PATH + '/app/media';

let APP_LOGIN_MEDIA_PATH = APP_ROOT_PATH + '/app/LoginMedia';

global.MediaPath = APP_MEDIA_PATH;

global.LoginMediaPath = APP_LOGIN_MEDIA_PATH;

//data limit per page
global.RECORED_PER_PAGE = 50;


//v0 Globals
global.loadUtility = (fileName) => {
    return require(APP_UTILITY_PATH + fileName);
};

global.loadSecurity = (fileName) => {
    return require(APP_SECURITY_PATH + fileName);
};

global.loadConfig = (fileName) => {
    return require(APP_CONFIG_PATH + fileName);
};

global.loadRoute = (fileName) => {
    return require(APP_ROUTES_PATH + fileName);
};

global.loadController = (fileName) => {
    return require(APP_CONTROLLER_PATH + fileName);
};

global.loadModal = (fileName) => {
    return require(APP_MODEL_PATH + fileName);
};

global.loadCrypt = () => {
    return require('lcrypt')('J92xtBr1tuLJV3mOFzMytJg4SDW0nirSAqMr7ZPGA4s=');
};


// v1 Globals

global.loadV1Controller = (fileName) => {
    return require(APP_V1_CONTROLLER_PATH + fileName);
};

global.loadV1Modal = (fileName) => {
    return require(APP_V1_MODEL_PATH + fileName);
};

global.loadV1Route = (fileName) => {
    return require(APP_V1_ROUTES_PATH + fileName);
};

global.loadV2Controller = (fileName) => {
    return require(APP_V2_CONTROLLER_PATH + fileName);
};

global.loadV2Route = (fileName) => {
    return require(APP_V2_ROUTES_PATH + fileName);
};

global.getMailTrasporter = () => {
    let nodemailer = require('nodemailer');
    // return nodemailer.createTransport({
    //     service: 'gmail',
    //     tls: {
    //         rejectUnauthorized: false
    //     },
    //     auth: {
    //         user: 'klydo.space@gmail.com',
    //         pass: 'gjmtlqstawahloch'
    //     }
    // });

    return nodemailer.createTransport({
        service: 'gmail',
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: 'kloudforj@gmail.com',
            pass: 'crtppscmkddfwzaj'
        }
    });
};

global.generateVerificationCode = (data) => {    
    let crypto = require('crypto');
    var myCipher = crypto.createCipher('aes-128-cbc', 'testpassword');
    var code = myCipher.update(data, 'utf8', 'hex');
    code += myCipher.final('hex');
    return code;
}

global.verifyVerificationCode = (data) => {    
    let crypto = require('crypto');    
    var myCipher = crypto.createDecipher('aes-128-cbc', 'testpassword');    
    var code = myCipher.update(data, 'hex', 'utf8');    
    code += myCipher.final('utf8');    
    return code;
}