const bookshelf = loadConfig('Bookshelf.js');

var Feelpals = bookshelf.Model.extend({
	tableName:'feelpals',
	hasTimestamps: true,
	softDelete: true,

	userProfileFollowing : function() {
		return this.hasOne(loadModal('UserProfile'),'followings','id');
	},

	userProfileFollower : function() {
		return this.hasOne(loadModal('UserProfile'),'followers','id');
	}
});

module.exports = Feelpals;
