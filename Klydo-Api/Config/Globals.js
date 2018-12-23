let v1Paths = APP_ROOT_PATH + '/app/v0/';
let v1RoutePaths = APP_ROOT_PATH + '/routes/';

//v1 Paths
let APP_MODEL_PATH = v1Paths + 'Models/';
let APP_CONTROLLER_PATH = v1Paths + 'Controller/';
let APP_UTILITY_PATH = v1Paths + 'Utility/';

//security paths
let APP_SECURITY_PATH = APP_ROOT_PATH + '/security/';

//config paths
let APP_CONFIG_PATH = APP_ROOT_PATH + '/Config/';

//route paths
let APP_ROUTES_PATH = v1RoutePaths + 'v0/';

//data limit per page
global.RECORED_PER_PAGE = 100;


global.loadUtility = (fileName) => {
    return require(APP_UTILITY_PATH + fileName);
}

global.loadSecurity = (fileName) => {
    return require(APP_SECURITY_PATH + fileName);
}

global.loadConfig = (fileName) => {
    return require(APP_CONFIG_PATH + fileName);
}

global.loadRoute = (fileName) => {
    return require(APP_ROUTES_PATH + fileName);
}

global.loadController = (fileName) => {
    return require(APP_CONTROLLER_PATH + fileName);
}

global.loadModal = (fileName) => {
    return require(APP_MODEL_PATH + fileName);
}

global.loadCrypt = () => {
    return require('lcrypt')('J92xtBr1tuLJV3mOFzMytJg4SDW0nirSAqMr7ZPGA4s=');
}

global.getMailTrasporter = () => {
    let nodemailer = require('nodemailer');
    return nodemailer.createTransport({
        service: 'gmail',
        tls: { 
            rejectUnauthorized: false 
        },
        auth: {
            user: 'klydo.space@gmail.com',
            pass: 'gjmtlqstawahloch'
        }
    });
}

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