let fcm = require('fcm-notification');
let FCM = new fcm(APP_ROOT_PATH + '/Config/firebase_admin_config.json');
let reactionType = ['Lovable', 'Deep', 'Badass', 'Smart', 'Hot', 'Funny', 'Cool'];

let sendPushNotificationToSingleDevice = async (token, type, doer, data, postId) => {
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
        notification: {
            title: message.title,
            body: body,
        },
        token: token,
        // priority: 'high',
        data: {
            type: type.toString(),
            data: data.toString(),
            dataId: postId.toString()
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

let sendPushNotificationToMultipleDevice = async (tokens, type) => {
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

    FCM.sendToMultipleToken(pushMessage, tokens, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
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
            "title": "Reaction",
            "body": "{doer} Reacted {data} On Your Post"
        }
    }
    if (type === 2) {
        return {
            "title": "Comment",
            "body": "{doer} Commented {data} On Your Post"
        }
    }
    if (type === 3) {
        return {
            "title": "Rating",
            "body": "{doer} Rated On Your Profile"
        }
    }
    if (type === 4) {
        return {
            "title": "Friend Request",
            "body": "{doer} Sent You Friend Request"
        }
    }
    if (type === 5) {
        return {
            "title": "Message",
            "body": "{doer} Sent You A Message"
        }
    }
    if (type === 6) {
        return {
            "title": "Bubble",
            "body": "{doer} Added A Post"
        }
    }
};

module.exports = {
    'sendPushNotificationToSingleDevice': sendPushNotificationToSingleDevice
};