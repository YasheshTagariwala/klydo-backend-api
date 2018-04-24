let Activity = require(APP_MODEL_PATH + 'Activity');

let createActivity = async activityType => {
    let [data,err] = await catchError(Activity.forge({activity_type : activityType}).save());    
    if(err)
        return null;
    else
        return data.id;        
}

let getActivity = async (req, res) => {
    let[activityData ,err] = await catchError(Activity.get());
    if(err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
    }else{
        res.status(OK_CODE).json({auth : true, msg : "Success" ,data : activityData});
    }
}

module.exports = {
    'createActivity' : createActivity,
    'getActivity' : getActivity
}