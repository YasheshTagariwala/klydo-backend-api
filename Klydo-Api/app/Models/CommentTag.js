const bookshelf = require('../../config/bookshelf.js');

var CommentTag = {
	tableName:'comment_tag'
}

module.exports = bookshelf.model('CommentTag', CommentTag)
