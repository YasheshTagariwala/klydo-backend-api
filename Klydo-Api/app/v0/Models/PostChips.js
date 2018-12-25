const bookshelf = loadConfig('Bookshelf.js');

var PostChips = bookshelf.Model.extend({
	tableName:'post_chips',
	hasTimestamps: true,
	softDelete: true,	
});

module.exports = PostChips;