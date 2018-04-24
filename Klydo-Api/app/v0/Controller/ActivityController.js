let Activity = require(APP_MODEL_PATH + 'Activity');
const bookshelf = require(APP_CONFIG_PATH + 'Bookshelf.js');

let createActivity = async activityType => {
    let [data,err] = await catchError(Activity.forge({activity_type : activityType}).save());    
    if(err)
        return null;
    else
        return data.id;        
}

TODO:'aliasing left in getUserActivity'

let getUserActivity = async (req, res) => {
    let[activityData ,err] = await catchError(Activity     
        .select(bookshelf.knex.raw(['id','activity_type','to_char(created_at,\'DD-MM-YYYY\') as date']))   
        .with({'feelpals' : (q) => {
            q.select('followers');
            q.withSelect('userProfileFollower',[bookshelf.knex.raw(['concat(trim(first_name), \' \' ,trim(last_name)) as name'])]);
        },'comments' : (q) => {
            q.select(['post_id','profile_id']);
            q.withSelect('userProfile',[bookshelf.knex.raw(['concat(trim(first_name), \' \' ,trim(last_name)) as name'])]);
        },'reactions' : (q) => {
            q.select(['post_id','profile_id']);
            q.withSelect('userProfile',[bookshelf.knex.raw(['concat(trim(first_name), \' \' ,trim(last_name)) as name'])]);
        },'slamReply' : (q) => {
            q.select(['slam_id','replier_id']);
            q.withSelect('userProfile',[bookshelf.knex.raw(['concat(trim(first_name), \' \' ,trim(last_name)) as name'])]);
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
        .get());
                
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
    'getUserActivity' : getUserActivity
}