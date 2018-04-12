const bookshelf = require('../../../Config/Bookshelf.js');

var Posts = bookshelf.Model.extend({
	tableName:'new_posts',
	hasTimestamps: true,
	softDelete: true,

	comments : function() {
		return this.hasMany(require('./PostComment'),'post_id');
	}
});

module.exports = Posts;
