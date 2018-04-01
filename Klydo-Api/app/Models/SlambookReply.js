const bookshelf = require('../../Config/Bookshelf.js');

require('./Activity');
require('./Slambook');
require('./UserProfile');

var SlambookReply = {
	tableName:'slambook_reply',
	hasTimestamps: true,
	softDelete: true,

	activity : function() {
		return this.hasOne('Activity','id','activity_id');
	},

	slambook : function() {
		return this.hasMany('Slambook','id','slam_id');
	},

	replier : function() {
		return this.hasMany('UserProfile','id','replier_id');
	}
}

module.exports = bookshelf.model('SlambookReply', SlambookReply)
