const bookshelf = require('../../config/bookshelf.js');

require('./Activity');
require('./Slambook');
require('./UserProfile');

var SlambookReply = {
	tableName:'slambook_reply',
	hasTimestamps: true,
	softDelete: true,

	activity : () => {
		return this.hasOne('Activity','id','activity_id');
	},

	slambook : () => {
		return this.hasMany('Slambook','id','slam_id');
	},

	replier : () => {
		return this.hasMany('UserProfile','id','replier_id');
	}
}

module.exports = bookshelf.model('SlambookReply', SlambookReply)
