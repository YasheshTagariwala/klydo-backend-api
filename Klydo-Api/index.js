const express = require('express');
var app = express();
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(express.json());

//All Application routes
require('./routes/route.js')(app);

app.listen(3000, () => {
  	console.log('Listening on 3000');
  })
