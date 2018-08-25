const bookshelf = loadConfig('Bookshelf.js');

var SlambookReply = bookshelf.Model.extend({
	tableName:'slambook_reply',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'replier_id','id');
	}
})

module.exports = SlambookReply;
