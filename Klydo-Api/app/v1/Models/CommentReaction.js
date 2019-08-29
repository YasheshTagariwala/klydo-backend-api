const bookshelf = loadConfig('Bookshelf.js');

var CommentReaction = bookshelf.Model.extend({
	tableName:'comment_reaction',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	},

	postComment : function () {
		return this.hasOne(loadModal('PostComment'),'comment_id','id');
	}

});

module.exports = CommentReaction;
