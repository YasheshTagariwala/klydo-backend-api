const bookshelf = require('../../config/bookshelf.js');

require('./UserProfile');

var UserExtra = {
	tableName:'user_extra'
	
	userProfile: function() {
		return this.hasOne('UserProfile','id','user_profile_id');
	}
};

module.exports = bookshelf.model('UserExtra',UserExtra)
