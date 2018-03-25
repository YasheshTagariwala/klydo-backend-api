const express = require('express');
//var UserProfile = require('./app/Controller/UserController');

const app = express();

app.listen(3000, () => {
  	console.log('listening on 3000')
})

app.use('/', require('./routes/route.js'));

// app.get('/',()=> {
// 	console.log('Hello');
// })

// app.get('/getAllUsers', UserProfile.getAllUsers);
// app.get('/getlogin', UserProfile.getLoginVerify);
// app.get('/compute', controller.compute);
// app.get('/countries', controller.countries);
// app.get('/users', controller.users);
