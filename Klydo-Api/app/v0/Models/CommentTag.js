const bookshelf = loadConfig('Bookshelf.js');

var CommentTag = bookshelf.Model.extend({
	tableName:'comment_tag',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = CommentTag;
