const bookshelf = require('../../Config/Bookshelf.js');

var PostReaction = bookshelf.Model.extend({
	tableName:'post_reaction',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = PostReaction;
