const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var SlambookReply = bookshelf.Model.extend({
	tableName:'slambook_reply',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = SlambookReply;
