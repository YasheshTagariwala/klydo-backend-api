const bookshelf = require('../../../Config/Bookshelf.js');

var PostComment = bookshelf.Model.extend({
	tableName:'post_comment',
	hasTimestamps: true,
	softDelete: true,

});

module.exports = PostComment;
