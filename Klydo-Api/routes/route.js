var express = require('express');
var app = express();
var UserProfile = require('../app/Controller/UserController');
var router = express.Router();

router.get('/getAllUsers', UserProfile.getAllUsers);
router.get('/getlogin', UserProfile.getLoginVerify);

// Define the home page route
router.get('/', function(req, res) {
  res.send('Write whole URL you lazy ass.');
});

module.exports = router;
