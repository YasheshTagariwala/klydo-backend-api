const bookshelf = require('../../config/bookshelf.js');

require('./CommentTag');
require('./Activity');
require('./Posts');
require('./UserProfile');

var PostComment = {
	tableName:'post_comment',
	hasTimestamps: true,
	softDelete: true,

	commentTag : () => {
		return this.blongsTo('CommentTag','id','comment_id');
	},

	activity : () => {
		return this.hasOne('Activity','id','activity_id');
	},

	posts : () => {
		return this.hasMany('Posts','id','post_id');
	},

	commenter : () => {
		return this.hasMany('UserProfile','id','profile_id');	
	}

}

module.exports = bookshelf.model('PostComment', PostComment)
