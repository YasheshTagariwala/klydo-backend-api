const config = require('./config.js');
const knex = require('knex')(config.db);
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin(require('bookshelf-eloquent'));

module.exports = bookshelf;
