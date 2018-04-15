const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var CommentTag = bookshelf.Model.extend({
	tableName:'comment_tag',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = CommentTag;
