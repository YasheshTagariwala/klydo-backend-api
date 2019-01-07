let http = require('http');
let UserProfile = loadModal('UserProfile');

let getResult = async (req , res) => {
    let data = '';
	http.get('http://klydo.space/graph/search_for/' + req.params.query,(resp) => {
        resp.on('data', (chunk) => {
            data += chunk;            
        })

        resp.on('end', () => {
            parseData(data,res);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });  
}

let parseData = async (data,res) => {
    let finalData = JSON.parse(data);
    if(!finalData.hasOwnProperty('people')){
        res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
    }else{
        if(finalData.people.length > 0){            
            let people = finalData.people;
            let [users,err] = await catchError(UserProfile.with('userExtra').whereIn('id' , people).get());
            if(err){
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg:INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }else{
                res.status(OK_CODE).json({auth: true, msg:'Success', data: users});
            }                    	
        }else{
            res.status(OK_CODE).json({auth : true, msg : 'No Data Found', data : []});		
        }
    }  
}

module.exports = {
	'getResult' : getResult
}