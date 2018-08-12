const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Feelpals = bookshelf.Model.extend({
	tableName:'feelpals',
	hasTimestamps: true,
	softDelete: true,

	userProfileFollowing : function() {
		return this.hasOne(require(APP_MODEL_PATH + 'UserProfile'),'followings','id');
	},

	userProfileFollower : function() {
		return this.hasOne(require(APP_MODEL_PATH + 'UserProfile'),'followers','id');
	}
});

module.exports = Feelpals;
