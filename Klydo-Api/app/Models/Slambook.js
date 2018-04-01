const bookshelf = require('../../config/bookshelf.js');

require('./UserProfile');
require('./SlambookReply');

var Slambook = {
	tableName:'slambook',
	hasTimestamps: true,
	softDelete: true,

	user : function() {
		return this.hasOne('UserProfile','id','user_profile_id');
	},

	slamReply : function() {
		return this.belongToMany('SlambookReply','id','slam_id');
	}
}

module.exports = bookshelf.model('Slambook', Slambook)
