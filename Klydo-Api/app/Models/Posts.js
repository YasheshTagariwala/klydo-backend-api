const bookshelf = require('../../config/bookshelf.js');

require('./UserProfile');
require('./Activity');
require('./PostComment');
require('./PostReaction');
require('./PostTag');

var Posts = {
	tableName:'new_posts',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function() {
		return this.hasOne('UserProfile','id','profile_id');
	},

	activity : function() {
		return this.hasOne('Activity','id','activity_id');
	},

	comments : function() {
		return this.belongsToMany('PostComment','id','post_id');
	},

	reaction : function() {
		return this.belongsToMany('PostReaction','id','post_id');
	},

	postTag : function() {
		return this.belongsTo('PostTag','id','post_id');
	}
}

module.exports = bookshelf.model('Posts', Posts)
