const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var PostTag = bookshelf.Model.extend({
	tableName:'post_tag',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = PostTag;
