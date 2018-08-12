const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var UserProfile = bookshelf.Model.extend({
	tableName:'user_profile',
	hasTimestamps: true,
	softDelete: true,

	userExtra: function() {
		return this.belongsTo(require(APP_MODEL_PATH + 'UserExtra'), 'id', 'user_profile_id');
	}
});

module.exports = UserProfile;
