const config = require(APP_CONFIG_PATH + 'Config.js');
const knex = require('knex')(config.db);
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');
bookshelf.plugin(require('bookshelf-eloquent'));
bookshelf.plugin(require('bookshelf-paranoia'));

module.exports = bookshelf;
