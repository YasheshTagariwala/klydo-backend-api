const UserExtra = require('../Models/UserExtra');
const UserProfile = require('../Models/UserProfile');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


var getAllUsers = function (req, res) {
	new UserExtra().with('userProfile').get()
		.then(function(users){
			res.json(users);
		}).catch(function(error){
			console.log(error);
		});
};

var getLoginVerify = function (req,res){
	new UserProfile().select(['user_email','user_password']).get()
		.then(function(users){
			res.json(users);
		}).catch(function(error){
			console.log(error);
		});
}

var loginCheck = function(req, res) {
	var uname = req.body.uname;
	var password = req.body.password;
	new UserProfile().select(['user_email','first_name','last_name']).where({'username': uname, 'user_password': password}).get()
		.then(function(users){
			if(users.toJSON() == '') {
				res.json({auth: false, msg: 'Authentication failed.'});
			} else {
				var jwt_token = jwt.sign({'uname':users.uname}, 'testsecretkey', {expiresIn:60})
				res.status(200).json({auth: true, msg: 'Save your token.', token: jwt_token});
			}
		}).catch(function(error){
			console.log(error);
		});
}

var checkToken = function(req, res) {
	var token = req.body.token;
	if(token.length > 0) {
		jwt.verify(token, 'testsecretkey', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
				res.json({auth: true, msg: 'Token Valid.'});
      }
    });
	}

}

module.exports = {
	'getAllUsers':getAllUsers,
	'getLoginVerify':getLoginVerify,
	'loginCheck' :loginCheck,
	'checkToken' :checkToken
}
