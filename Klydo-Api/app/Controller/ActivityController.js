let Activity = require('../Models/Activity');
let statusCode = require('../Utility/HTTPStatusCodes');
let catchError = require('../../Config/ErrorHandling');
let constants = require('../Utility/KlydoConstants');

let createActivity = async activityType => {
    Activity.forge({activity_type : activityType}).save().then(data => { return data.id });    
}

module.exports = {
    'createActivity' : createActivity
}