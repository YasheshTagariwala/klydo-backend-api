const bookshelf = require('../../config/bookshelf.js');

require('./UserProfile');
require('./Activity');

var Posts = {
	tableName:'new_posts',
	hasTimestamp:false,

	userProfile: function() {
		return this.hasOne('UserProfile','id','profile_id');
	},

	activity : function(){
		return this.hasOne('Activity','id','activity_id');	
	}
}

module.exports = bookshelf.model('Posts', Posts)
