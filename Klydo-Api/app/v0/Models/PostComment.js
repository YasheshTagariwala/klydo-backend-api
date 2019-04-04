const bookshelf = loadConfig('Bookshelf.js');

var PostComment = bookshelf.Model.extend({
	tableName:'post_comment',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	},

	posts : function(){
		return this.hasOne(loadModal('Posts'),'post_id','id');
	},

	commentReaction : function () {
		return this.belongsTo(loadV1Modal('CommentReaction'), 'id', 'comment_id')
	}

});

module.exports = PostComment;
