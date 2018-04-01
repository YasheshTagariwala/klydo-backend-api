const bookshelf = require('../../Config/Bookshelf.js');

require('./Posts');

var PostTag = {
	tableName:'post_tag',
	hasTimestamps: true,
	softDelete: true,

	posts : function() {
		return this.hasOne('Posts','id','post_id');
	}
}

module.exports = bookshelf.model('PostTag', PostTag)
