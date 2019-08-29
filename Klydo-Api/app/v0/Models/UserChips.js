const bookshelf = loadConfig('Bookshelf.js');

var UserChips = bookshelf.Model.extend({
	tableName:'user_chips',
	hasTimestamps: true,
	softDelete: true,	
});

module.exports = UserChips;