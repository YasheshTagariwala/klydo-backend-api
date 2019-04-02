let request = require('request');
let UserProfile = loadModal('UserProfile');
let host = 'http://';
let protocol = 'localhost:9090';
let plugin = '/plugins/restapi';
let api_version = '/v1';
let shared_secret_key = 'zlMTWTtQtVIIEts8';

// var myJSONObject = { ... };
// request({
//     url: "http://josiahchoi.com/myjson",
//     method: "POST",
//     json: true,   // <--Very important!!!
//     body: myJSONObject
// }, function (error, response, body){
//     console.log(response);
// });

// var myXMLText = '<xml>...........</xml>'
// request({
//     url: "http://josiahchoi.com/myjson",
//     method: "POST",
//     headers: {
//         "content-type": "application/xml",  // <--Very important!!!
//     },
//     body: myXMLText
// }, function (error, response, body){
//     console.log(response);
// });

let createUser = async (req, res) => {
    let url = host + protocol + plugin + api_version + '/users';
    let [data, err] = await catchError(UserProfile.where('user_email', req.body.email).first());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
    }
    data = data.toJSON();
    let responseData = {
        username: data.id,
        password: data.id,
        name: data.first_name.trim() + " " + data.last_name.trim(),
        email: req.body.email
    };

    let options = {
        url: url,
        method: 'POST',
        json: true,
        body: responseData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": shared_secret_key
        }
    };

    request(options, function (err, response, body) {
        if (response.statusCode !== 201) {
            res.status(INTERNAL_SERVER_ERROR_CODE).json({
                auth: true,
                msg: INTERNAL_SERVER_ERROR_MESSAGE,
                err: response
            });
        } else {
            res.status(OK_CODE).json({auth: true, msg: "User Created Successfully", data: response});
        }
    });
};

let updateUser = async (req, res) => {
    let url = host + protocol + plugin + api_version + '/users';
    let [data, err] = await catchError(UserProfile.where('user_email', req.body.email).first());
    if (err) {
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: true, msg: INTERNAL_SERVER_ERROR_MESSAGE});
    }
    data = data.toJSON();
    let responseData = {
        username: req.body.email.replace("@", '-'),
        name: data.first_name + " " + data.last_name,
        email: req.body.email
    };

    let options = {
        url: url,
        method: 'PUT',
        json: true,
        body: responseData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": shared_secret_key
        }
    };

    request(options, function (err, response, body) {
        if (response.statusCode !== 201) {
            res.status(INTERNAL_SERVER_ERROR_CODE).json({
                auth: true,
                msg: INTERNAL_SERVER_ERROR_MESSAGE,
                err: response
            });
        } else {
            res.status(OK_CODE).json({auth: true, msg: "User Created Successfully", data: response});
        }
    });
};

let searchUser = async (req, res) => {
    let url = host + protocol + plugin + api_version + '/users/' + req.params.user;

    let options = {
        url: url,
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Authorization": shared_secret_key
        }
    };

    request(options, function (err, response, body) {
        if (response.statusCode !== 201) {
            res.status(INTERNAL_SERVER_ERROR_CODE).json({
                auth: true,
                msg: INTERNAL_SERVER_ERROR_MESSAGE,
                err: response
            });
        } else {
            res.status(OK_CODE).json({auth: true, msg: "User Found Successfully", data: response});
        }
    });
};

let createRoasterUser = async (req, res) => {
    let url = host + protocol + plugin + api_version + '/users/' + req.params.user + '/roster';
    let responseData = '<rosterItem>' +
        '<jid>' + req.body.jid + '@message.owyulen.com</jid>' +
        '<nickname>' + req.body.name + '</nickname>' +
        '<subscriptionType>3</subscriptionType>' +
        '<groups> ' +
        '<group>Friends</group>' +
        '</groups> ' +
        '</rosterItem>';

    let options = {
        url: url,
        method: 'POST',
        body: responseData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/xml",
            "Authorization": shared_secret_key
        }
    };

    request(options, function (err, response, body) {
        if (response.statusCode !== 201) {
            res.status(INTERNAL_SERVER_ERROR_CODE).json({
                auth: true,
                msg: INTERNAL_SERVER_ERROR_MESSAGE,
                err: response
            });
        } else {
            let url = host + protocol + plugin + api_version + '/users/' + req.body.jid + '/roster';
            let responseData = '<rosterItem>' +
                '<jid>' + req.params.user + '@message.owyulen.com</jid>' +
                '<nickname>' + req.body.creator_name + '</nickname>' +
                '<subscriptionType>3</subscriptionType>' +
                '<groups> ' +
                '<group>Friends</group>' +
                '</groups> ' +
                '</rosterItem>';

            let options = {
                url: url,
                method: 'POST',
                body: responseData,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/xml",
                    "Authorization": shared_secret_key
                }
            };
            request(options, function (err, response, body) {
                if (response.statusCode !== 201) {
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({
                        auth: true,
                        msg: INTERNAL_SERVER_ERROR_MESSAGE,
                        err: response
                    });
                } else {
                    res.status(OK_CODE).json({
                        auth: true,
                        msg: "User Roster Entry Created Successfully",
                        data: response
                    });
                }
            });
        }
    });
};

let getRoasterUserEntry = async (req, res) => {
    let url = host + protocol + plugin + api_version + '/users/' + req.params.user + '/roster';

    let options = {
        url: url,
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Authorization": shared_secret_key
        }
    };

    request(options, async function (err, response, body) {
        if (response.statusCode !== 200) {
            res.status(INTERNAL_SERVER_ERROR_CODE).json({
                auth: true,
                msg: INTERNAL_SERVER_ERROR_MESSAGE,
                err: response
            });
        } else {
            let data = JSON.parse(body);
            data = data.rosterItem;
            let userIds = [];
            for (let i = 0; i < data.length; i++) {
                userIds.push(data[i].jid.replace("@message.owyulen.com",""));
            }
            let [userData,err] = await catchError(UserProfile
                .select(['id', 'first_name', 'last_name'])
                .withSelect('userExtra', ['profile_image'])
                .whereIn('id',userIds)
                .get());
            if(err) {
                console.log(err);
                res.status(INTERNAL_SERVER_ERROR_CODE).json({
                    auth: true,
                    msg: INTERNAL_SERVER_ERROR_MESSAGE
                });
            }else {
                res.status(OK_CODE).json({auth: true, msg: "Users Found Successfully", data: userData});
            }
        }
    });
};

module.exports = {
    'createUser': createUser,
    'updateUser': updateUser,
    'searchUser': searchUser,
    'createRoasterUser': createRoasterUser,
    'getRoasterUserEntry': getRoasterUserEntry
};