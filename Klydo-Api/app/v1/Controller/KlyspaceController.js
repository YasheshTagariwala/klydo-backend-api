let KlyspaceData = loadModal('KlyspaceData');
let Klyspace = loadModal('Klyspace');
let Graph = loadV1Controller('GraphController');
let PushNotification = loadV1Controller('PushNotification');
let UserTokenMaster = loadV1Modal('UserTokenMaster');
let UserProfile = loadModal('UserProfile');

let getKlyspaceData = async (req, res) => {

    let [data,err] = await catchError(KlyspaceData.select(['id','klyspace_data','doer_profile_id', 'doee_profile_id'])
        .withSelect('doerUserProfile', ['first_name', 'last_name'], (q) => {
            q.withSelect('userExtra', ['profile_image'])
        })
        .where('doee_profile_id',req.params.user_id).get());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        res.status(OK_CODE).json({auth: true, data : data});
    }
};

let addKlyspaceData = async (req, res) => {

    let [checkData, err] = await catchError(KlyspaceData.where({
        'doer_profile_id': req.body.friend_id,
        'doee_profile_id': req.body.profile_id
    }).first());

    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (checkData) {
            let updateData = {
                'klyspace_data': JSON.stringify(req.body.klyspace_data)
            };

            let [update, err] = await catchError(KlyspaceData.where('id', checkData.toJSON().id)
                .save(updateData, {patch: true}));

            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }
        } else {
            let insertData = {
                'klyspace_data': JSON.stringify(req.body.klyspace_data),
                'doer_profile_id': req.body.friend_id,
                'doee_profile_id': req.body.profile_id
            };

            let [insert, err] = await catchError(KlyspaceData.forge(insertData).save());

            if (err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            }
        }
    }

    let [token, err5] = await catchError(UserTokenMaster.where('profile_id', req.body.profile_id).first());
    if (err5) {
        console.log(err5);
    } else {
        if (token) {
            token = token.toJSON();
            let [doer, err] = await catchError(UserProfile.where('id', req.body.friend_id).first());
            doer = doer.toJSON();
            await PushNotification.sendPushNotificationToSingleDevice(token.firebase_token, 3, doer.first_name.trim() + ' ' + doer.last_name.trim(), "", req.body.profile_id);
        }
    }

    let [data, err1] = await catchError(KlyspaceData.select('klyspace_data')
        .where('doee_profile_id', req.body.profile_id)
        .whereNot('doer_profile_id', req.body.profile_id)
        .get());
    data = data.toJSON();

    let [variables, err2] = await catchError(Klyspace.select(['id'])
        .where('status', true)
        .orderBy('id', 'asc')
        .get());

    variables = variables.toJSON();

    let vector = [];
    for (let i = 0; i < variables.length; i++) {
        let tempData = data.filter((obj) => {
            return obj.klyspace_data.indexOf((+variables[i].id)) > -1
        });

        vector.push(tempData.length / data.length);
    }

    await Graph.updateUserWyu(req.body.profile_id, vector);

    res.status(OK_CODE).json({auth: true, msg: "KlySpace Data Updated Successfully"});
};

module.exports = {
    'getKlyspaceData': getKlyspaceData,
    'addKlyspaceData': addKlyspaceData,
};