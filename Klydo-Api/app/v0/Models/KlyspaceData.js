const bookshelf = loadConfig('Bookshelf.js');

var KlyspaceData = bookshelf.Model.extend({
	tableName:'klyspace_data',
	hasTimestamps: true,
	softDelete: true,

    doerUserProfile : function() {
        return this.hasOne(loadModal('UserProfile'),'doer_profile_id','id');
    },

	doeeUserProfile : function() {
        return this.hasOne(loadModal('UserProfile'),'doee_profile_id','id');
    },

	klySpace : function () {
		return this.hasOne(loadModal('Klyspace'),'klyspace_id','id')
    }
});

module.exports = KlyspaceData;
