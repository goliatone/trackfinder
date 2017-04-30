'use strict';

const express = require('express');
const TrackFinder = require('../index');

const app = express();

TrackFinder.register(app);

var server = app.listen(3333, function(){
    console.log('');
    console.log('Express server running on:');
    console.log(' http://localhost:%s', server.address().port);
});
