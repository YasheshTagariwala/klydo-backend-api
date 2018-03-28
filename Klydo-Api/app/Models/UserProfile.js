const bookshelf = require('../../bookshelf.js');
require('./UserExtra');
var UserProfile = {
	tableName:'user_profile',
	hasTimestamp:false,

	userExtra: function(){
		return this.belongsTo('UserExtra', 'id', 'user_profile_id');
	}
};

module.exports = bookshelf.model('UserProfile',UserProfile)
