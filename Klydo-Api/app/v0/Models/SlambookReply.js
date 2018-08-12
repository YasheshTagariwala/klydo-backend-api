const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var SlambookReply = bookshelf.Model.extend({
	tableName:'slambook_reply',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(require(APP_MODEL_PATH + 'UserProfile'),'replier_id','id');
	}
})

module.exports = SlambookReply;
