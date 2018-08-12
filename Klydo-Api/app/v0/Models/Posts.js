const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var Posts = bookshelf.Model.extend({
	tableName:'new_posts',
	hasTimestamps: true,	
	softDelete: true,

	comments : function() {
		return this.belongsToMany(require(APP_MODEL_PATH + 'PostComment'),'post_comment','post_id','id');
	},

	userProfile : function() {
		return this.hasOne(require(APP_MODEL_PATH + 'UserProfile'),'profile_id','id');
	}
});

module.exports = Posts;
