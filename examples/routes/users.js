'use strict';

let Route = {};

Route.priority = 1;

let response = {
    id: 1,
    name: 'peperone',
    email: 'pepe@rone.com'
};

Route.register = function(app, options) {
    options.logger.info('- users: register routes');

    app.get('/me', function(req, res){
        res.status(200).json(response);
    });
};

module.exports = Route;
module.exports.response = response;
