const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Feelpals = bookshelf.Model.extend({
	tableName:'feelpals',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function() {
		return this.hasOne(require(APP_MODEL_PATH + 'UserProfile'),'followings' || 'followers');
	}
});

module.exports = Feelpals;
