const bookshelf = require('../../config/bookshelf.js');

require('./Activity');

var Feelpals = {
	tableName:'feelpals',
	hasTimestamps: true,
	softDelete: true,

	activity : function() {
		return this.hasOne('Activity','id','activity_id');
	}
}

module.exports = bookshelf.model('Feelpals', Feelpals)
