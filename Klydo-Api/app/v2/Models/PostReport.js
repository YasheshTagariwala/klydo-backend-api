const bookshelf = loadConfig('Bookshelf.js');

var PostWatch = bookshelf.Model.extend({
	tableName:'post_report',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	},

	posts : function () {
		return this.hasOne(loadModal('Posts'),'post_id','id');
	}

});

module.exports = PostWatch;
