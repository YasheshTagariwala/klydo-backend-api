const bookshelf = require('../../../Config/Bookshelf.js');

var Activity = bookshelf.Model.extend({
	tableName:'activity',
	hasTimestamps: true,
	softDelete: true,
});

module.exports = Activity;
