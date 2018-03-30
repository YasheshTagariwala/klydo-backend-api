const bookshelf = require('../../config/bookshelf.js');

require('./Posts');

var PostTag = {
	tableName:'post_tag',
	hasTimestamps: true,
	softDelete: true,

	posts : () => {
		return this.hasOne('Posts','id','post_id');
	}
}

module.exports = bookshelf.model('PostTag', PostTag)
