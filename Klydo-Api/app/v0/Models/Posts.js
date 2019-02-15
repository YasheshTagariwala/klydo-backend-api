const bookshelf = loadConfig('Bookshelf.js');

var Posts = bookshelf.Model.extend({
	tableName:'new_posts',
	hasTimestamps: true,	
	softDelete: true,

	comments : function() {
		return this.hasMany(loadModal('PostComment'),'post_id','id');
	},

	userProfile : function() {
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	},

	reactions : function() {
		return this.hasMany(loadModal('PostReaction'),'post_id','id');
	},

    reaction : function() {
        return this.belongsTo(loadModal('PostReaction'),'id','post_id');
    }
});

module.exports = Posts;
