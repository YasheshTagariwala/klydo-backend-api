let Klyspace = loadModal('Klyspace');
let KlyspaceData = loadModal('KlyspaceData');

let addNewKlyspaceName = async (req, res) => {
    let klyspace = {
        'name': req.body.name,
        'status': req.body.status
    };

    let [data, err] = await catchError(Klyspace.forge(klyspace).save());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Klyspace Variable Created Successfully"});
    }
};

let updateKlyspaceStatus = async (req, res) => {
    let klyspace = {
        'status': req.body.status
    };

    let [data, err] = await catchError(Klyspace.where('id', req.body.klyspace_id)
        .save(klyspace, {patch: true}));

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Klyspace Variable Status Changed Successfully"});
    }
};

let updateKlyspaceName = async (req, res) => {
    let klyspace = {
        'name': req.body.name
    };

    let [data, err] = await catchError(Klyspace.where('id', req.body.klyspace_id)
        .save(klyspace, {patch: true}));

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, msg: "Klyspace Variable Name Changed Successfully"});
    }
};

let addKlyspaceData = async (req, res) => {
    let klyspaceData = req.body.klyspace_data;
    let klyspaceDataArray = [];
    let errors = [];

    for (let i = 0; i < klyspaceData.length; i++) {
        let tempData = {
            'doer_profile_id': klyspaceData[i].friend_id,
            'doee_profile_id': klyspaceData[i].profile_id,
            'klyspace_id': klyspaceData[i].klyspace_id,
            'data': klyspaceData[i].data
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

                let [data1, err1] = await catchError(KlyspaceData.forge(tempdata).save());
                if(err1){
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
            }
        }
    }

    if (errors.length === 0) {
        res.status(OK_CODE).json({auth: true, msg: "KlyspaceData Added Successfully"});
    }
};

let getAllKlyspaceVariables = async (req, res) => {
    let [data,err] = await catchError(Klyspace.select(['id','name']).where('status',true).get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, data : data});
    }
};

module.exports = {
    'addNewKlyspaceName': addNewKlyspaceName,
    'updateKlyspaceStatus': updateKlyspaceStatus,
    'updateKlyspaceName': updateKlyspaceName,
    'addKlyspaceData': addKlyspaceData,
    'getAllKlyspaceVariables' : getAllKlyspaceVariables
};