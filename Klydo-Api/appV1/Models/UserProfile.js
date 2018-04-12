const bookshelf = require('../../Config/Bookshelf.js');

var UserProfile = bookshelf.Model.extend({
	tableName:'user_profile',
	hasTimestamps: true,
	softDelete: true,

	userExtra: function() {
		return this.hasOne(require('./UserExtra'), 'id', 'user_profile_id');
	}
});

module.exports = UserProfile;
