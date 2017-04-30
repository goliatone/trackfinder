'use strict';

let Route = {};

Route.priority = 10;

Route.mountpath = '/api';

Route.middleware = [
    function(req, res, next){
        console.log('Logger middleware');
        next();
    }
];

let _resources = {
    users: [{
        id: 1,
        name: 'peperone',
        email: 'pepe@rone.com'
    }],
    pets: [{
        id: 1,
        name: 'Colonel Meow'
    },{
        id: 2,
        name: 'Choupette'
    },{
        id: 3,
        name: 'Casper'
    }]
};

Route.routes = {
    'GET /:resource': function(req, res) {
        res.json(_resources[req.params.resource]);
    },
    'GET /:resource/:id(\\d+)': function(req, res) {
        let id = req.params.id;
        let resource = req.params.resource;
        console.log('id %s, resource %s', id, resource);
        let resources = _resources[resource];

        resource = resources.find(function( obj ) {
            return obj.id === id;
        });

        res.json(resource);
    },
    'POST /:resource': function(req, res) {
        let model = req.params.body;
        let resource = req.params.resource;
        let resources = _resources[resource];
        resources[model.id] = model;
        res.json(model);
    },
    'PUT /:resource/:id': function(req, res) {

    },
    'PATCH /:resource/:id': function(req, res) {

    },
    'DELETE /:resource/:id': function(req, res) {

    }
};

module.exports = Route;
