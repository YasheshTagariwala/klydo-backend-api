const bookshelf = require('../../config/bookshelf.js');

require('./Posts');
require('./Feelpals');
require('./PostComment');
require('./SlambookReply');

var Activity = {
	tableName:'activity',
	hasTimestamps: true,
	softDelete: true,

  	posts : function() {
  		return this.belongsTo('Posts','id','activity_id');
  	},

  	feelpals : function() {
  		return this.belongsTo('Feelpals','id','activity_id');	
  	},

  	comments : function() {
  		return this.belongsTo('PostComment','id','activity_id');	
  	},

    slamReply : function() {
      return this.belongsTo('SlambookReply','id','activity_id');
    }
}

module.exports = bookshelf.model('Activity', Activity)
