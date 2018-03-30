const bookshelf = require('../../config/bookshelf.js');

var SlambookReply = {
  tableName:'slambook_reply'
}

module.exports = bookshelf.model('SlambookReply', SlambookReply)
