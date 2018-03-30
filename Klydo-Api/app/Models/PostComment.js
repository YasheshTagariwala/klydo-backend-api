const bookshelf = require('../../config/bookshelf.js');

var PostComment = {
  tableName:'post_comment'
}

module.exports = bookshelf.model('PostComment', PostComment)
