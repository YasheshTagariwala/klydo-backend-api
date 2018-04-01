const bookshelf = require('../../config/bookshelf.js');

require('./Posts');

var PostReaction = {
	tableName:'post_reaction',
	hasTimestamps: true,
	softDelete: true,

	posts : function() {
		return this.hasMany('Posts','id','post_id');
	}
}

module.exports = bookshelf.model('PostReaction', PostReaction)
