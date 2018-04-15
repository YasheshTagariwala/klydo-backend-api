let Activity = require(APP_MODEL_PATH + 'Activity');

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