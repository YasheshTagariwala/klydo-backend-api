const bookshelf = loadConfig('Bookshelf.js');

var UserProfile = bookshelf.Model.extend({
	tableName:'user_profile',
	hasTimestamps: true,
	softDelete: true,

	userExtra: function() {
		return this.belongsTo(loadModal('UserExtra'), 'id', 'user_profile_id');
	},

	userFollowings: function() {
		return this.belongsTo(loadModal('Feelpals'), 'id', 'followings');
	}
});

module.exports = UserProfile;
