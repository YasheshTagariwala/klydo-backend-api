let KlyspaceData = loadModal('KlyspaceData');

let addKlyspaceData = async (req, res) => {
    let requestData = req.body.klyspace_data;
    let dataArray = [];
    let oldklyspaceDataArray = [];
    let newklyspaceDataArray = [];

    for (let i = 0; i < requestData.length; i++) {
        let tempData = {
            'klyspace_id': requestData[i],
            'data': 0
        };
        dataArray.push(tempData);
    }

    let [data, err] = await catchError(KlyspaceData.where({
        'doer_profile_id': req.body.friend_id,
        'doee_profile_id': req.body.profile_id
    }).get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        let to_not_delete = [];
        data = data.toJSON();
        for (let i = 0; i < dataArray.length; i++) {
            if (i in data) {
                let updateData = {
                    'klyspace_id': dataArray[i].klyspace_id,
                };
                let [updateKly, err] = await catchError(KlyspaceData.where({id: data[i].id}).save(updateData, {patch: true}));
                if (err) {
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
                to_not_delete.push(data[i].id);
            } else {
                let insertData = {
                    'doer_profile_id': req.body.friend_id,
                    'doee_profile_id': req.body.profile_id,
                    'klyspace_id': dataArray[i].klyspace_id,
                    'data': 0
                };

                let [insertKly, err] = await catchError(KlyspaceData.forge(insertData).save());
                if (err) {
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
            }
        }

        for (let i = 0; i < data.length; i++) {
            if (to_not_delete.indexOf(data[i].id) <= -1) {
                let [deleteKly, err] = await catchError(KlyspaceData.forge({id: data[i].id}).destroy());
                if (err) {
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                    return;
                }
            }
        }

        res.status(OK_CODE).json({auth: true, msg: "KlySpace Data Updated Successfully"});
    }

    // let oldWyuID = (oldklyspaceDataArray.reduce((a,b) => a + b,0)) / oldklyspaceDataArray.length;
    // let newWyuID = (newklyspaceDataArray.reduce((a,b) => a + b,0)) / newklyspaceDataArray.length;

    // await Graph.updateUserWyu(req.body.profile_id,oldWyuID,newWyuID);
};

module.exports = {
    'addKlyspaceData': addKlyspaceData,
};