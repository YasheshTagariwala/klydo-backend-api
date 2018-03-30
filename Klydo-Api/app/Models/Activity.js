const bookshelf = require('../../config/bookshelf.js');

require('./Posts');

var Activity = {
	tableName:'activity'

  	posts : function(){
  		return this.belongsTo('Posts','id','activity_id');
  	}
}

module.exports = bookshelf.model('Activity', Activity)
