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

	userProfile: () => {
		return this.hasOne('UserProfile','id','profile_id');
	},

	activity : () => {
		return this.hasOne('Activity','id','activity_id');
	},

	comments : () => {
		return this.belongsToMany('PostComment','id','post_id');
	},

	reaction : () => {
		return this.belongsToMany('PostReaction','id','post_id');
	},

	postTag : () => {
		return this.belongsTo('PostTag','id','post_id');
	}
}

module.exports = bookshelf.model('Posts', Posts)
