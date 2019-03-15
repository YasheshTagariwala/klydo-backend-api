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
        let all_insert_data = [];
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
                all_insert_data.push(insertData);
            }
        }

        if (all_insert_data.length > 0) {
            let klyData = KlyspaceData.collection();
            klyData.add(all_insert_data);
            let [insertKly, err] = await catchError(klyData.insert(false));
            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }
        }

        let to_delete = [];
        for (let i = 0; i < data.length; i++) {
            if (to_not_delete.indexOf(data[i].id) <= -1) {
                to_delete.push(data[i].id);
            }
        }

        let [deleteKly, err] = await catchError(KlyspaceData.whereIn('id', to_delete).delete());
        if (err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
            return;
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