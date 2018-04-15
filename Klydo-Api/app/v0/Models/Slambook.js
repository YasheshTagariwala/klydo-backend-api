const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Slambook = bookshelf.Model.extend({
	tableName:'slambook',
	hasTimestamps: true,
	softDelete: true,
})

module.exports = Slambook;
