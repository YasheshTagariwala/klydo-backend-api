const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Activity = bookshelf.Model.extend({
	tableName:'activity',
	hasTimestamps: true,
	softDelete: true,
});

module.exports = Activity;
