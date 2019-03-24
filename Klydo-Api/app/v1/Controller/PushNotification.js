let fcm = require('fcm-notification');
let FCM = new fcm(APP_ROOT_PATH + '/Config/firebase_admin_config.json');
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
            "body": "{doer}: ACTUAL_MESSAGE_HERE" // for messaging
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

module.exports = {
    'sendPushNotificationToSingleDevice': sendPushNotificationToSingleDevice,
    'sendPushNotificationToMultipleDevice': sendPushNotificationToMultipleDevice
};