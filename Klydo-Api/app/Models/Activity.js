const bookshelf = require('../../config/bookshelf.js');

require('./Posts');

var Activity = {
	tableName:'activity',
	hasTimestamp:false,

  	posts : function(){
  		return this.belongsTo('Posts','id','activity_id');
  	}
}

module.exports = bookshelf.model('Activity', Activity)
