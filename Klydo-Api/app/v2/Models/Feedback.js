const bookshelf = loadConfig('Bookshelf.js');

var Feedback = bookshelf.Model.extend({
    tableName:'feedback',
    hasTimestamps: true,
    softDelete: true,

    userProfile : function(){
        return this.hasOne(loadModal('UserProfile'),'profile_id','id');
    },

});

module.exports = Feedback;
