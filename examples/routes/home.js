'use strict';

let response = '<h3>Hello TrackFinder</h3>';

module.exports = function(app, options) {
    options.logger.info('- home: register routes');

    app.get('/', function(req, res){
        res.status(200).send(response);
    });
};

module.exports.response = response;
