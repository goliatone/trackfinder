'use strict';

module.exports = function(app, options){
    console.log('- home: register routes');

    app.get('/', function(req, res){
        res.status(200).send('<h3>Hello TrackFinder</h3>');
    });
};
