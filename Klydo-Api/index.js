const express = require('express');
var app = express();


//All Application routes
require('./routes/route.js')(app);

app.listen(3000, () => {
  	console.log('listening on 3000')
})

