const bookshelf = loadConfig('Bookshelf.js');

var PostWatch = bookshelf.Model.extend({
	tableName:'profile_report',
	hasTimestamps: true,
	softDelete: true,

	userProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'profile_id','id');
	},

	reportProfile : function(){
		return this.hasOne(loadModal('UserProfile'),'report_profile_id','id');
	}

});

module.exports = PostWatch;
