const bookshelf = require('../../config/bookshelf.js');

require('./UserExtra');
require('./Posts');
require('./PostComment');
require('./Slambook');
require('./SlambookReply');

var UserProfile = {
	tableName:'user_profile',
	hasTimestamps: true,
	softDelete: true,

	userExtra: () => {
		return this.belongsTo('UserExtra', 'id', 'user_profile_id');
	},

	posts : () => {
		return this.belongsTo('Posts','id','profile_id');
	},

	commenter : () => {
		return this.belongsToMany('PostComment','id','profile_id');
	},

	slambook : () => {
		return this.belongsTo('Slambook','id','user_profile_id');
	},

	slamReply : () => {
		return this.belongsToMany('SlambookReply','id','replier_id');
	}
};

module.exports = bookshelf.model('UserProfile',UserProfile)
