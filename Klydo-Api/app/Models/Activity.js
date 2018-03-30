const bookshelf = require('../../config/bookshelf.js');

require('./Posts');
require('./Feelpals');
require('./PostComment');
require('./SlambookReply');

var Activity = {
	tableName:'activity',
	hasTimestamps: true,
	softDelete: true,

  	posts : () => {
  		return this.belongsTo('Posts','id','activity_id');
  	},

  	feelpals : () => {
  		return this.belongsTo('Feelpals','id','activity_id');	
  	},

  	comments : () => {
  		return this.belongsTo('PostComment','id','activity_id');	
  	},

    slamReply : () => {
      return this.belongsTo('SlambookReply','id','activity_id');
    }
}

module.exports = bookshelf.model('Activity', Activity)
