var express = require('express');
var tracks = require('../index');

var PORT = 3333;
var app = express();
app.set('port', PORT);

tracks.register(app, {
    path:'./examples/routes'
});

app.listen(PORT, function(){
    console.log('Express server running on', PORT);
});