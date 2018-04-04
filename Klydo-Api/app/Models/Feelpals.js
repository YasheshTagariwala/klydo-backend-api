const bookshelf = require('../../Config/Bookshelf.js');

var Feelpals = bookshelf.Model.extend({
	tableName:'feelpals',
	hasTimestamps: true,
	softDelete: true,
});

module.exports = Feelpals;
