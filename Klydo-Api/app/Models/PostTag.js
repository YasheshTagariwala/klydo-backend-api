const bookshelf = require('../../config/bookshelf.js');

var PostTag = {
  tableName:'post_tag'
}

module.exports = bookshelf.model('PostTag', PostTag)
