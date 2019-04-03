let fcm = require('fcm-notification');
let FCM = new fcm(APP_ROOT_PATH + '/Config/firebase_admin_config.json');
let UserTokenMaster = loadV1Modal('UserTokenMaster');
let UserProfile = loadModal('UserProfile');
let reactionType = ['Lovable', 'Deep', 'Badass', 'Smart', 'Hot', 'Funny', 'Cool'];

let sendPushNotificationToSingleDevice = async (token, type, doer, data, postId, image) => {
    let message = getMessage(type);
    let body = '';
    if (data === '') {
        body = message.body.replace('{doer}', doer);
    } else {
        body = message.body.replace('{doer}', doer);
        if (type === 1) {
            body = body.replace('{data}', reactionType[data]);
        } else {
            body = body.replace('{data}', data);
        }
    }

    let pushMessage = {
        // notification: {
        //     title: message.title,
        //     body: body,
        // },
        token: token,
        // priority: 'high',
        data: {
            title: message.title.replace("{doer}", doer),
            body: body,
            type: type.toString(),
            data: data.toString(),
            dataId: postId.toString(),
            image : image
        }
    };

    FCM.send(pushMessage, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(response);
        }
    });
};

let sendPushNotificationToMultipleDevice = async (tokens, type, doer, data, postId, image) => {
    let message = getMessage(type);
    let body = '';
    if (data === '') {
        body = message.body.replace('{doer}', doer);
    } else {
        body = message.body.replace('{doer}', doer);
        body = body.replace('{data}', data);
    }

    let pushMessage = {
        // notification: {
        //     title: message.title,
        //     body: body,
        // },
        // priority: 'high',
        data: {
            title: message.title.replace("{doer}", doer),
            body: body,
            type: type.toString(),
            data: data.toString(),
            dataId: postId.toString(),
            image : image
        }
    };

    FCM.sendToMultipleToken(pushMessage, tokens, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(response);
        }
    });
};

let sendPushNotificationToSingleTopic = async (topic, type) => {
    let message = getMessage(type);
    let body = '';
    if (data === '') {
        body = message.body.replace('{doer}', doer);
    } else {
        body = message.body.replace('{doer}', doer);
        body = body.replace('{data}', data);
    }

    let pushMessage = {
        notification: {
            title: message.title,
            body: body,
        },
        token: token,
        // priority: 'high',
        data: {
            type: type,
            data: data
        }
    };

    FCM.send(pushMessage, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
};

let sendPushNotificationToMultipleTopic = async (topics, type) => {
    let message = getMessage(type);
    let body = '';
    if (data === '') {
        body = message.body.replace('{doer}', doer);
    } else {
        body = message.body.replace('{doer}', doer);
        body = body.replace('{data}', data);
    }

    let pushMessage = {
        notification: {
            title: message.title,
            body: body,
        },
        token: token,
        // priority: 'high',
        data: {
            type: type,
            data: data
        }
    };

    FCM.sendToMultipleTopic(pushMessage, topics, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    });
};

let getMessage = (type) => {
    if (type === 1) {
        return {
            "title": "{doer}",
            "body": "{doer} reacted {data} on your post."
        }
    }
    if (type === 2) {
        return {
            "title": "{doer}",
            "body": "{doer} commented on your post: \"{data}\""
        }
    }
    if (type === 3) {
        return {
            "title": "{doer}",
            "body": "{doer} rated your personality!"
        }
    }
    if (type === 4) {
        return {
            "title": "{doer}",
            "body": "{doer} wants to follow you."
        }
    }
    if (type === 5) {
        return {
            "title": "{doer}",
            "body": "{doer}: MESSAGE" // for messaging
        }
    }
    if (type === 6) {
        return {
            "title": "{doer}",
            "body": "{doer} wrote a new post." //
        }
    }
    if (type === 7) {
        return {
            "title": "{doer}",
            "body": "You are now following {doer}."
        }
    }
    if (type === 8) {
        return {
            "title": "{doer}",
            "body": "{doer} updated their status."
        }
    }
    if (type === 9) {
        return {
            "title": "{doer}",
            "body": "{doer} uploaded a new picture."
        }
    }
};

let sendMessagePush = async (req, res) => {
    let token = 'a249b595-161d-426e-9623-50fd9333933a';
    if(token == req.body.token){
        let [pushUser, err] = await catchError(UserTokenMaster.where('profile_id', req.body.to.replace("@message.owyulen.com","")).first());
        if(err) {
            console.log(err);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true,msg : INTERNAL_SERVER_ERROR_MESSAGE});
        }
        let [doerUser, err1] = await catchError(UserProfile.with('userExtra').where('id', req.body.from.replace("@message.owyulen.com","")).first());
        if(err1) {
            console.log(err1);
            res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true,msg : INTERNAL_SERVER_ERROR_MESSAGE});
        }
        let actualBody = JSON.parse(req.body.body);
        let message = getMessage(5);
        doerUser = doerUser.toJSON();
        pushUser = pushUser.toJSON();
        let body = message.body.replace('{doer}', doerUser.first_name.trim() + ' ' + doerUser.last_name.trim());
        body = body.replace("MESSAGE",actualBody.msg);
        let pushMessage = {
            token: pushUser.firebase_token,
            data: {
                title: message.title.replace("{doer}", doerUser.first_name.trim() + ' ' + doerUser.last_name.trim()),
                body: body,
                type: "5",
                data: req.body.to.replace("@message.owyulen.com",""),
                dataId: req.body.to.replace("@message.owyulen.com",""),
                image : doerUser.userExtra.profile_image
            }
        };

        FCM.send(pushMessage, (err, response) => {
            if (err) {
                console.log(err);
            } else {
                res.status(OK_CODE).json({auth : true,msg : OK_MESSAGE});
                // console.log(response);
            }
        });
    }else {
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : true,msg : INTERNAL_SERVER_ERROR_MESSAGE});
    }
    // { token: 'a249b595-161d-426e-9623-50fd9333933a',
    //     from: '6@message.owyulen.com',
    //     to: '5@message.owyulen.com',
    //     body:
    //     '{"isMine":true,"msg":"Nnnnnnnnnnnnnnnnn","msgIdl":504,"receiver":"5","sender":"6","type":"TEXT"}' }
    // console.log(req.body);
};

module.exports = {
    'sendPushNotificationToSingleDevice': sendPushNotificationToSingleDevice,
    'sendPushNotificationToMultipleDevice': sendPushNotificationToMultipleDevice,
    'sendMessagePush' : sendMessagePush
};