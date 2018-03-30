const bookshelf = require('../../config/bookshelf.js');

require('./PostComment');

var CommentTag = {
	tableName:'comment_tag',
	hasTimestamps: true,
	softDelete: true,

	comments : () => {
		return this.hasOne('PostComment','id','comment_id');
	}

}

module.exports = bookshelf.model('CommentTag', CommentTag)
