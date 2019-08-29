const bookshelf = loadConfig('Bookshelf.js');

var UserExtra = bookshelf.Model.extend({
	tableName:'user_extra',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'user_profile_id','id');
	}
});

module.exports = UserExtra;
