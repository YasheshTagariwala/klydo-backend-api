const bookshelf = require('../../config/bookshelf.js');

require('./UserExtra');
require('./Posts');


var UserProfile = {
	tableName:'user_profile',
	hasTimestamp:false,

	userExtra: function(){
		return this.belongsTo('UserExtra', 'id', 'user_profile_id');
	},

	posts : function(){
		return this.belongsTo('Posts','id','profile_id');
	}
};

module.exports = bookshelf.model('UserProfile',UserProfile)
