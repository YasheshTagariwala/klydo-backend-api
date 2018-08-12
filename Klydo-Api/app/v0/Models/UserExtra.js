const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

var UserExtra = bookshelf.Model.extend({
	tableName:'user_extra',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(require(APP_MODEL_PATH + 'UserExtra'),'user_profile_id','id');
	}
});

module.exports = UserExtra;
