'use strict';

var Route = {};

Route.priority = 1;

Route.register = function(app, options){
    console.log('- users: register routes');
    app.get('/me', function(req, res){
        res.status(200).json({
            id: 1,
            name: 'peperone',
            email: 'pepe@rone.com'
        });
    });
};

module.exports = Route;
