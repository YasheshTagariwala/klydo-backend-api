let Activity = loadModal('Activity');
let Validation = loadUtility('Validations');

let createActivity = async activityType => {    
    let [data,err] = await catchError(Activity.forge({activity_type : activityType}).save());    
    if(err)
        return null;
    else
        return data.id;        
}

let getUserActivity = async (req, res) => {
    let offset = (req.query.page) ? (req.query.page - 1) * RECORED_PER_PAGE : 0;
    let[activityData ,err] = await catchError(Activity
        .select(['id','activity_type','created_at'])        
        .with({'feelpals' : (q) => {
            q.select('followers');
            q.withSelect('userProfileFollower',['first_name','last_name']);
        },'comments' : (q) => {
            q.select(['post_id','profile_id']);
            q.withSelect('userProfile',['first_name','last_name']);     
        },'reactions' : (q) => {
            q.select(['post_id','profile_id']);
            q.withSelect('userProfile',['first_name','last_name']);            
        },'slamReply' : (q) => {
            q.select(['slam_id','replier_id']);
            q.withSelect('userProfile',['first_name','last_name']);            
        }})
        .where((q) => {            
            q.whereHas('comments',(q) => {
                q.whereNot('profile_id' , req.params.id);
            })        
            q.orWhereHas('feelpals',(q) => {
                q.whereNot('followers' , req.params.id);
                q.where('accepted' , true);
            })        
            q.orWhereHas('reactions',(q) => {
                q.whereNot('profile_id' , req.params.id);
            })
            q.orWhereHas('slamReply',(q) => {
                q.whereNot('replier_id' , req.params.id);
            })   
        })
        .orderBy('id','desc')
        .offset(offset)
		.limit(RECORED_PER_PAGE)        
        .get());
                
    if(err){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true, msg : INTERNAL_SERVER_ERROR_MESSAGE});
		return;
    }else{
        if(!Validation.objectEmpty(activityData)){			
			res.status(OK_CODE).json({auth : true, msg : "Success" ,data : activityData});
		}else{
			res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
		}        
    }
}

module.exports = {
    'createActivity' : createActivity,
    'getUserActivity' : getUserActivity
}