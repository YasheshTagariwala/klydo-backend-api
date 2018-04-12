const bookshelf = require('../../Config/Bookshelf.js');

var UserExtra = bookshelf.Model.extend({
	tableName:'user_extra',
	hasTimestamps: true,
	softDelete: true,
});

module.exports = UserExtra;
