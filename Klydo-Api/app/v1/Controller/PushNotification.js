let fcm = require('fcm-notification');
let FCM = new fcm(APP_ROOT_PATH + '/Config/firebase_admin_config.json');

let sendPushNotificationToSingleDevice = async (token) => {

    let pushMessage = {
        notification: {
            title: "Something Happened",
            body: "Something Happened Body",
        },
        token: token,
        data: {
            somedata: "somedata"
        }
    };

    FCM.send(pushMessage, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
        }
    })
};

module.exports = {
    'sendPushNotificationToSingleDevice': sendPushNotificationToSingleDevice
};