const bookshelf = loadConfig('Bookshelf.js');

var PostComment = bookshelf.Model.extend({
	tableName:'post_comment',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	}

});

module.exports = PostComment;
