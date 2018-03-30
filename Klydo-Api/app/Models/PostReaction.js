const bookshelf = require('../../config/bookshelf.js');

var PostReaction = {
  tableName:'post_reaction'
}

module.exports = bookshelf.model('PostReaction', PostReaction)
