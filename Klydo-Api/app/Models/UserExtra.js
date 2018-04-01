const bookshelf = require('../../Config/Bookshelf.js');

require('./UserProfile');

var UserExtra = {
	tableName:'user_extra',
	hasTimestamps: true,
	softDelete: true,
	
	userProfile: function() {
		return this.hasOne('UserProfile','id','user_profile_id');
	}
};

module.exports = bookshelf.model('UserExtra',UserExtra)
