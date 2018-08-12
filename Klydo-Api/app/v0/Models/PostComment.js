const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var PostComment = bookshelf.Model.extend({
	tableName:'post_comment',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(require(APP_MODEL_PATH + 'UserProfile'),'profile_id','id');
	}

});

module.exports = PostComment;
