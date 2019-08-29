'use strict';

const app = require('./app');

const server = app.listen(3333, function(){
    console.log('');
    console.log('Express server running on:');
    console.log(' http://localhost:%s', server.address().port);
});
