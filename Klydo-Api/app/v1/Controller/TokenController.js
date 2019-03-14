let TokenMaster = loadV1Modal('UserTokenMaster');
let Validation = loadUtility('Validations');

let updateUserToken = async (req, res) => {
    if (Validation.objectEmpty(req.body.token)) {
        res.status(OK_CODE).json({auth: true, msg: 'Empty Token Found'});
    }

    if (Validation.objectEmpty(req.body.user_id)) {
        res.status(OK_CODE).json({auth: true, msg: 'Empty User Id'});
    }

    let [tokenMaster, err] = await catchError(TokenMaster.where('profile_id', req.body.user_id).first());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
        return;
    } else {
        if (!Validation.objectEmpty(tokenMaster)) {
            let updateToken = {
                'firebase_token': req.body.token,
            };

            let [data, err1] = await catchError(TokenMaster.where('profile_id',req.body.user_id).save(updateToken, {patch: true}));
            if (err1) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            } else {
                res.status(OK_CODE).json({auth: true, msg: 'Token Updated'});
            }
        } else {
            let storeToken = {
                'firebase_token': req.body.token,
                'profile_id': req.body.user_id
            };

            let [data, err1] = await catchError(TokenMaster.forge(storeToken).save());
            if (err1) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
                return;
            } else {
                res.status(OK_CODE).json({auth: true, msg: 'Token Added'});
            }
        }
    }
};

let getUserToken = async (user_id) => {
    let [tokenMaster, err] = await catchError(TokenMaster.where('profile_id', user_id).first());
    if (err) {
        console.log(err);
        return null;
    } else {
        return tokenMaster.toJSON().firebase_token;
    }
};

module.exports = {
    'updateUserToken': updateUserToken,
    'getUserToken': getUserToken
};