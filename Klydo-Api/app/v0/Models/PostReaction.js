const bookshelf = loadConfig('Bookshelf.js');

var PostReaction = bookshelf.Model.extend({
	tableName:'post_reaction',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	}
})

module.exports = PostReaction;
