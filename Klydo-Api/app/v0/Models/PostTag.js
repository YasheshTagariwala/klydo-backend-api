const bookshelf = loadConfig('Bookshelf.js');

var PostTag = bookshelf.Model.extend({
	tableName:'post_tag',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = PostTag;
