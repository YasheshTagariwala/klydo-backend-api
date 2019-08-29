const bookshelf = loadConfig('Bookshelf.js');

var Activity = bookshelf.Model.extend({
	tableName:'activity',
	hasTimestamps: true,
	softDelete: true,

	posts : function() {
		return this.belongsTo(loadModal('Posts'),'id','activity_id');
	},

	feelpals : function() {
		return this.belongsTo(loadModal('Feelpals'),'id','activity_id');
	},

	comments : function() {
		return this.belongsTo(loadModal('PostComment'),'id','activity_id');
	},

	reactions : function() {
		return this.belongsTo(loadModal('PostReaction'),'id', 'activity_id');
	},

	slamReply : function() {
		return this.belongsTo(loadModal('SlambookReply'),'id', 'activity_id');
	}
});

module.exports = Activity;