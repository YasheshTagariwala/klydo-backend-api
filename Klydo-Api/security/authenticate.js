let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let debugSHA = "C1:98:1B:F6:2C:0B:55:BC:12:C2:A2:F6:D3:EF:1D:E7:D5:17:AD:65";

let validateToken = async (token,SHA) => {
    let valid = '';
    if(token){
        if(token.length > 0) {
            try {
                await jwt.verify(loadCrypt().decode(token), 'testsecretkey', (err, decoded) => {
                    if (err) {
                        valid = JSON.stringify({'auth': false, 'msg': 'Failed to authenticate token.' });
                    } else {
                        if(debugSHA == SHA) {
                            // if everything is good, save to request for use in other routes
                            valid = JSON.stringify({'auth': true, 'msg': 'Token Valid.'});
                        }else {
                            valid = JSON.stringify({'auth': false, 'msg': 'Failed to authenticate token.' });
                        }
                    }
                });
            }catch (e) {
                valid = JSON.stringify({'auth': false, 'msg': 'Invalid Token.'});
            }
        } else {
            valid = JSON.stringify({'auth': false, 'msg': 'Invalid Token.'});
        }
    }else {
        valid = JSON.stringify({'auth': false, 'msg': 'Invalid Token.'});
    }
    return JSON.parse(valid);
}


let createToken = async value => {
    let token = await jwt.sign({'uname':value}, 'testsecretkey', {expiresIn:'365d'});
    return loadCrypt().encode(token);
}


module.exports = {
    'validateToken' : validateToken,
    'createToken' : createToken
}
