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

	userProfile : function() {
		return this.belongsTo(loadModal('UserProfile'),'id', 'activity_id');
	},

	userExtra : function() {
		return this.belongsTo(loadModal('UserExtra'),'id', 'activity_id');
	},

	klyspaceData : function() {
		return this.belongsTo(loadModal('KlyspaceData'),'id', 'activity_id');
	}
});

module.exports = Activity;