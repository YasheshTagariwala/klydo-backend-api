const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Activity = bookshelf.Model.extend({
	tableName:'activity',
	hasTimestamps: true,
	softDelete: true,

	posts : function() {
		return this.belongsTo(require(APP_MODEL_PATH + 'Posts'),'id','activity_id');
	},

	feelpals : function() {
		return this.belongsTo(require(APP_MODEL_PATH + 'Feelpals'),'id','activity_id');
	},

	comments : function() {
		return this.belongsTo(require(APP_MODEL_PATH + 'PostComment'),'id','activity_id');
	},

	reactions : function() {
		return this.belongsTo(require(APP_MODEL_PATH + 'PostReaction'),'id', 'activity_id');
	},

	slamReply : function() {
		return this.belongsTo(require(APP_MODEL_PATH + 'SlambookReply'),'id', 'activity_id');
	}
});

module.exports = Activity;