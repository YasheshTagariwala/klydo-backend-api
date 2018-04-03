let Activity = require('../Models/Activity');
let catchError = require('../../Config/ErrorHandling');

let createActivity = async activityType => {
    let [data,err] = await catchError(Activity.forge({activity_type : activityType}).save());    
    if(err)
        return null;
    else
        return data.id;        
}

module.exports = {
    'createActivity' : createActivity
}