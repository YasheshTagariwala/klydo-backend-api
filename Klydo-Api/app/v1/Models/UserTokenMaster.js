const bookshelf = loadConfig('Bookshelf.js');

var UserTokenMaster = bookshelf.Model.extend({
    tableName:'user_token_master',
    hasTimestamps: true,
    softDelete: true,

    userProfile : function() {
        return this.hasOne(loadModal('UserProfile'),'profile_id','id');
    },
});

module.exports = UserTokenMaster;