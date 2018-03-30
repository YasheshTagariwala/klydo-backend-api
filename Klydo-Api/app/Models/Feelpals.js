const bookshelf = require('../../config/bookshelf.js');

var Feelpals = {
  tableName:'feelpals'
}

module.exports = bookshelf.model('Feelpals', Feelpals)
