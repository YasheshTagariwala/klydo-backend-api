let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = loadConfig('Config.js');
let keys = [];
if(config.env === 'test') {
    keys = [
        "C1:98:1B:F6:2C:0B:55:BC:12:C2:A2:F6:D3:EF:1D:E7:D5:17:AD:65",
        "9F:C3:3C:36:C9:0C:71:AF:5E:21:48:0D:B7:F9:FD:58:B3:49:5F:C4",
        "8E:10:3F:AC:9B:69:18:69:0F:91:09:A3:46:5F:CE:5A:E3:0F:CF:40",
        "76:7E:87:53:29:E7:FA:B6:E2:87:BC:61:E1:17:A3:C8:A1:4A:40:B4",
        "84:B0:C2:6F:96:86:73:F6:6F:5F:DD:54:0D:4A:65:D1:31:E3:D5:3B",
        "2E:1F:B3:B1:17:EF:F3:46:D1:01:A9:9C:E0:13:BA:10:DC:56:F4:CE"
    ];
}else {
    keys = ["98:5C:8B:8B:BF:98:37:68:9A:E5:C6:82:0E:E9:BA:1F:2E:43:80:68"];
}

let validateToken = async (token, SHA) => {
    let valid = '';
    if (token) {
        if (token.length > 0) {
            try {
                await jwt.verify(loadCrypt().decode(token), 'testsecretkey', (err, decoded) => {
                    if (err) {
                        valid = JSON.stringify({'auth': false, 'msg': 'Failed to authenticate token.'});
                    } else {
                        if (keys.indexOf(SHA) !== -1) {
                            // if everything is good, save to request for use in other routes
                            valid = JSON.stringify({'auth': true, 'msg': 'Token Valid.'});
                        } else {
                            valid = JSON.stringify({'auth': false, 'msg': 'Failed to authenticate token.'});
                        }
                    }
                });
            } catch (e) {
                valid = JSON.stringify({'auth': false, 'msg': 'Invalid Token.'});
            }
        } else {
            valid = JSON.stringify({'auth': false, 'msg': 'Invalid Token.'});
        }
    } else {
        valid = JSON.stringify({'auth': false, 'msg': 'Invalid Token.'});
    }
    return JSON.parse(valid);
};


let createToken = async value => {
    let token = await jwt.sign({'uname': value}, 'testsecretkey', {expiresIn: '365d'});
    return loadCrypt().encode(token);
};


module.exports = {
    'validateToken': validateToken,
    'createToken': createToken
};
