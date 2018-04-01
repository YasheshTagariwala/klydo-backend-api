const bookshelf = require('../../Config/Bookshelf.js');

require('./PostComment');

var CommentTag = {
	tableName:'comment_tag',
	hasTimestamps: true,
	softDelete: true,

	comments : function() {
		return this.hasOne('PostComment','id','comment_id');
	}

}

module.exports = bookshelf.model('CommentTag', CommentTag)
