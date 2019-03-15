let Klyspace = loadModal('Klyspace');
let KlyspaceData = loadModal('KlyspaceData');
let Graph = loadController('GraphController');

let voteOnKly = async (req, res) => {
};

let rateOnKly = async (req, res) => {
};

let fetchKly = async (req, res) => {
};

let addKlyspaceData = async (req, res) => {
    let klyspaceData = req.body.klyspace_data;
    let klyspaceDataArray = [];
    let errors = [];
    let oldklyspaceDataArray = [];
    let newklyspaceDataArray = [];

    for (let i = 0; i < klyspaceData.length; i++) {
        let tempData = {
            'doer_profile_id': req.body.friend_id,
            'doee_profile_id': req.body.profile_id,
            'klyspace_id': klyspaceData[i],
            'data': 0
            // 'data': klyspaceData[i].data

        };
        klyspaceDataArray.push(tempData);
    }


    for (let i = 0; i < klyspaceDataArray.length; i++) {
        let [data, err] = await catchError(KlyspaceData.where({
                'klyspace_id': klyspaceDataArray[i].klyspace_id,
                'doer_profile_id': klyspaceDataArray[i].doer_profile_id,
                'doee_profile_id': klyspaceDataArray[i].doee_profile_id
            }
        ).first());

        if (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
        } else {
            if (data) {
                let tempdata = {
                    'data': klyspaceDataArray[i].data
                };

                data = data.toJSON();
                oldklyspaceDataArray.push(data.data);
                newklyspaceDataArray.push(klyspaceDataArray[i].data);

                let [data1, err1] = await catchError(KlyspaceData.where('id', data.id).save(tempdata, {patch: true}));
                if(err1){
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
            } else {
                let tempdata = {
                    'klyspace_id': klyspaceDataArray[i].klyspace_id,
                    'doer_profile_id': klyspaceDataArray[i].doer_profile_id,
                    'doee_profile_id': klyspaceDataArray[i].doee_profile_id,
                    'data': klyspaceDataArray[i].data
                };

                oldklyspaceDataArray.push(klyspaceDataArray[i].data);
                newklyspaceDataArray.push(klyspaceDataArray[i].data);

                let [data1, err1] = await catchError(KlyspaceData.forge(tempdata).save());
                if(err1){
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
            }
        }
    }

    // let oldWyuID = (oldklyspaceDataArray.reduce((a,b) => a + b,0)) / oldklyspaceDataArray.length;
    // let newWyuID = (newklyspaceDataArray.reduce((a,b) => a + b,0)) / newklyspaceDataArray.length;

    // await Graph.updateUserWyu(req.body.profile_id,oldWyuID,newWyuID);

    if (errors.length === 0) {
        res.status(OK_CODE).json({auth: true, msg: "KlyspaceData Added Successfully"});
    }
};

module.exports = {
    'voteOnKly': voteOnKly,
    'rateOnKly': rateOnKly,
    'fetchKly': fetchKly,
    'addKlyspaceData': addKlyspaceData,
};