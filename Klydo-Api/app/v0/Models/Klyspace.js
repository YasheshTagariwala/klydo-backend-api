const bookshelf = loadConfig('Bookshelf.js');

var Klyspace = bookshelf.Model.extend({
	tableName:'klyspace',
	hasTimestamps: true,
	softDelete: true
});

module.exports = Klyspace;
