const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var PostComment = bookshelf.Model.extend({
	tableName:'post_comment',
	hasTimestamps: true,
	softDelete: true,

});

module.exports = PostComment;
