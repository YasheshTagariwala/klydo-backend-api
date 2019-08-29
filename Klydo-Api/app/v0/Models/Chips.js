const bookshelf = loadConfig('Bookshelf.js');

var Chips = bookshelf.Model.extend({
	tableName:'chips',
	hasTimestamps: true,
	softDelete: true,	
});

module.exports = Chips;