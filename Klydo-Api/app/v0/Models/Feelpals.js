const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Feelpals = bookshelf.Model.extend({
	tableName:'feelpals',
	hasTimestamps: true,
	softDelete: true,
});

module.exports = Feelpals;
