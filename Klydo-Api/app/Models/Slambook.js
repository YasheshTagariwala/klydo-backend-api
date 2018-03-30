const bookshelf = require('../../config/bookshelf.js');

var Slambook = {
  tableName:'slambook'
}

module.exports = bookshelf.model('Slambook', Slambook)
