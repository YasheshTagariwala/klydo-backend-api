const bookshelf = require('../../bookshelf.js');

var UserProfile = {
	tableName:'user_profile',
	hasTimestamp:false,	
};

module.exports = bookshelf.model('UserProfile',UserProfile)