let Graph = loadController('GraphController');
//login users
let loginCheck = async (req, res) => {	
	let UserProfile = loadModal('UserProfile');
	let authenticate = loadSecurity('authenticate');
	let validations = loadUtility('Validations');
	let uname = req.body.uname;
	let password = req.body.password;

	if(validations.empty(uname)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}
	if(validations.empty(password)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}

	let [users,err] = await catchError(UserProfile.withSelect('userExtra',['profile_image','profile_privacy']).select(['id']).
										where({'username': uname, 'user_password': password})
										.orWhere({'user_email' : uname ,'user_password' : password}).first());
	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {		
		if(validations.objectEmpty(users)) {
			res.status(NOT_FOUND_CODE).json({auth: false, msg: NOT_FOUND_MESSAGE});
			return;
		} else {
			let [jwt_token,err] = await catchError(authenticate.createToken(users.uname));
			if(err) {
				console.log(err);
				res.status(UNAUTHORIZED_CODE).json({auth: false, msg:UNAUTHORIZED_MESSAGE});
				return;
			} else {
				res.status(OK_CODE).json({auth: true, msg: 'Login Successfull.', token: jwt_token ,data : users});				
			}
		}
	}
}

//forget password api
let forgetPassword = async (req, res) => {	
	let validations = loadUtility('Validations');
	let UserProfile = loadModal('UserProfile');
	let uname = req.body.uname;
	let password = req.body.password;	

	if(validations.empty(uname)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}
	if(validations.empty(password)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}	

	uname = verifyVerificationCode(uname);

	let [users,err] = await catchError(UserProfile.where({'username': uname})
						.orWhere({'user_email' : uname}).first());
	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg:INTERNAL_SERVER_ERROR_MESSAGE});
		return;
	} else {			
		if(validations.objectEmpty(users)) {
			res.status(NOT_FOUND_CODE).json({auth: false, msg: NOT_FOUND_MESSAGE});
			return;
		} else {			
			let newUserData = {
				user_password : password
			}			

			let [data ,err] = await catchError(UserProfile.where({'username': uname})
				.orWhere({'user_email' : uname})
				.save(newUserData ,{patch : true})
			);			

			if(err) {
				console.log(err);
				res.status(UNAUTHORIZED_CODE).json({auth: false, msg:UNAUTHORIZED_MESSAGE});
				return;
			} else {
				res.status(OK_CODE).json({auth: true, msg : "Password Changed Successfully" , data : 1});
			}
		}
	}
}

let forgetPasswordVerificationCode = async(req, res) => {		
	let validations = loadUtility('Validations');	
	let uname = req.body.uname;

	if(validations.empty(uname)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}

	var data = generateVerificationCode(uname);	

	var mailOptions = {
		from: 'klydo.space@gmail.com',
		to: uname,
		subject: 'Forgot Password OTP',
		text: data
	  };

	getMailTrasporter().sendMail(mailOptions,(error,info) => {
		if (error) {
			console.log(error);
			res.status(UNAUTHORIZED_CODE).json({auth: false, msg:UNAUTHORIZED_MESSAGE});
		  } else {			  
			console.log('Email sent: ' + info.response);
			res.status(OK_CODE).json({auth: true , msg : "Verification Code Sent Successfully"});		
		  }
		getMailTrasporter().close();
	})	

}

//sign up users
let signupUser = async (req, res) => {
	let UserExtra = loadModal('UserExtra');
	let validations = loadUtility('Validations');
	let UserProfile = loadModal('UserProfile');
	let UserChips = loadModal('UserChips');
    let authenticate = loadSecurity('authenticate');
	let requestData = req.body;
	if(validations.objectEmpty(requestData)) {
		res.status(NO_CONTENT_CODE).json({auth: false, msg:NO_CONTENT_MESSAGE});
		return;
	}

	let [check,er] = await catchError(UserProfile.where({'user_email' : requestData.mail}).first());
	if(er){
        console.log(err);
        res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
        return;
	}

	if(check){
        res.status(OK_CODE).json({auth : true,msg : "Email Already Taken"});
        return;
	}

	let userData = {
		first_name : requestData.fname,
		middle_name : requestData.mname,
		last_name : requestData.lname,
		dob : requestData.birth_date,
		city : requestData.city in requestData ? requestData.city : 4564,
		gender : requestData.sex,
		user_email : requestData.mail,
		username : requestData.mail,
		user_password : requestData.pass,		
		mobile_number : requestData.number in requestData ? requestData.number : 1234567891,
		about_me : requestData.about in requestData ? requestData.about : ''
	};

	let [data , err] = await catchError(UserProfile.forge(userData).save());
    let year = requestData.birth_date.split('-');
    await Graph.manipulateUser(data.id,requestData.fname,requestData.lname,year[0]);
    var userId = data.id;

	if(err) {
		console.log(err);
		res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
		return;
	}else{
        var profile_image = null;
        let filename = '';
        if (req.files) {
            profile_image = req.files.profile_image;
            filename = '';
            if (profile_image) {
                var moment = require('moment');
                filename = userId + '-' + moment(new Date()).format('YYYY-MM-DD-HH-mm-ss') + profile_image.name.substring(profile_image.name.lastIndexOf('.'));
                let [data, err] = await catchError(profile_image.mv(MediaPath + '/' + filename));
                if (err) {
                    console.log(err);
                    res.status(INTERNAL_SERVER_ERROR_CODE).json({auth: false, msg: INTERNAL_SERVER_ERROR_MESSAGE})
                    return;
                }
            }
        }
		let userExtra = {
			user_profile_id : userId,
			profile_image : filename === "" ? null : filename
		};

		let [data1 , err1] = await catchError(UserExtra.forge(userExtra).save());

		if(err1) {
			console.log(err1);
			res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE})
			return;
		}else{			
			// let chip_data = [];
			// for(let i = 0;i < requestData.chips.length; i++){
			// 	let chip_set = {};
			// 	chip_set.chip_id = requestData.chips[i];
			// 	chip_set.user_id = data.id;
			// 	chip_data.push(chip_set);
			// }
			// let user_chip_data = UserChips.collection();
			// user_chip_data.add(chip_data);
			// let[data2,err2] = await catchError(user_chip_data.insert());

			// if(err2){
			// 	console.log(err2);
			// 	res.status(INTERNAL_SERVER_ERROR_CODE).json({auth : false,msg : INTERNAL_SERVER_ERROR_MESSAGE});
			// 	return;
			// }else{
                let [jwt_token,err] = await catchError(authenticate.createToken(requestData.mail));
                let [users,err3] = await catchError(UserProfile.withSelect('userExtra',['profile_image','profile_privacy']).select(['id'])
									.where({'id' : userId}).first());
				res.status(OK_CODE).json({auth : true,msg : "Sign Up Success", token : jwt_token ,data : users});
			// }
		}
	}	
};

let getTrendsLogin = async (req, res) => {
    let fs = require('fs');
    let imageArray = [];
    await fs.readdir(LoginMediaPath, function (err,files) {
        if(err){
            console.log(err);
        }

        files.forEach(function (file) {
            imageArray.push(file);
        });

        imageArray = shuffle(imageArray).slice(0,30);

        let data = {images : imageArray};

        res.status(OK_CODE).json({auth : true, msg : 'Data Found' , data : data});
    });
};

let shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

let LoginMedia = async (req, res) => {
    let fs = require('fs');
    if(fs.existsSync(LoginMediaPath + '/' + req.params.filename)){
        res.sendFile(LoginMediaPath + '/' + req.params.filename);
    }
};

module.exports = {
	'loginCheck': loginCheck,
	'signupUser' : signupUser,
	'forgetPassword' : forgetPassword,
	'forgetPasswordVerificationCode' : forgetPasswordVerificationCode,
	'getTrendsLogin' : getTrendsLogin,
	'LoginMedia' : LoginMedia
};
