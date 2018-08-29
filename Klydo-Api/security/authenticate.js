let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

let validateToken = async token => {
	let valid = '';
	if(token){
		if(token.length > 0) {
			await jwt.verify(loadCrypt().decode(token), 'testsecretkey', (err, decoded) => {
				if (err) {
					valid = JSON.stringify({'auth': false, 'msg': 'Failed to authenticate token.' });
				} else {
					// if everything is good, save to request for use in other routes
					valid = JSON.stringify({'auth': true, 'msg': 'Token Valid.'});
				}
			});
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
