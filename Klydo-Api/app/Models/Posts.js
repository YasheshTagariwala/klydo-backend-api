const bookshelf = require('../../config/bookshelf.js');

var Posts = {
  tableName:'new_posts',
  hasTimestamp:false,
}

module.exports = bookshelf.model('Posts', Posts)
