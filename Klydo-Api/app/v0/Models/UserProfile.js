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
	},

	userFollowers: function() {
		return this.belongsTo(loadModal('Feelpals'), 'id', 'followers');
	},

	usersFollowings: function() {
		return this.hasMany(loadModal('Feelpals'), 'followings', 'id');
	},

	usersFollowers: function() {
		return this.hasMany(loadModal('Feelpals'), 'followers', 'id');
	},

	klyspaceData: function() {
		return this.hasMany(loadModal('KlyspaceData'), 'doee_profile_id', 'id');
	},

	posts: function() {
		return this.hasMany(loadModal('Posts'), 'profile_id', 'id');
	}
});

module.exports = UserProfile;
