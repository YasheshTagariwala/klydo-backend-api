const bookshelf = loadConfig('Bookshelf.js');

var PostReaction = bookshelf.Model.extend({
	tableName:'post_reaction',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	},

    posts : function(){
        return this.hasOne(loadModal('Posts'),'post_id','id');
    },
});

module.exports = PostReaction;
