'use strict';
const express = require('express');

const _get = require('./utils').get;
const _isFunction = require('./utils').isFunction;

function mountRouteFiles(app, config, files=[]) {

    let router,
        args,
        method,
        routers = [],
        registered = false;

    files.forEach(function(route) {
        args = [];

        router = express.Router();
        this.logger.info('Mounting route "%s"', route._ref);

        //Route can export namespace
        if (route[this.mountpath]){
            args.push(_get(route, this.mountpath));
        }

        if (route[this.middleware]) {
            var middleware = _get(route, this.middleware);

            if(!Array.isArray(middleware)) {
                middleware = [middleware];
            }

            args.push(middleware);
        }

        args.push(router);

        if (_isFunction(route)) {
            registered = true;
            route(router, config, app);
        }

        if (_isFunction(route.register)) {
            registered = true;
            route.register(router, config, app);
        }

        if (route.routes) {
            var handler, verb, parameters, bits;
            Object.keys(route.routes).forEach(function(key) {
                registered = true;

                handler = route.routes[key];
                bits = key.split(' ');
                verb = bits[0].toLowerCase();
                parameters = bits[1];
                this.logger.info('Add: "%s"\t%s', verb.toUpperCase(), parameters);
                router[verb].call(router, parameters, handler);
            }, this);
        }

        //TODO: This does not seem helpful?!
        this.methods.forEach(function(verb) {
            method = route[verb];

            if (!_isFunction(method)){
                return;
            }

            registered = true;
            method.call(router, route.resource, method);
        });

        if(!registered){
            this.logger.warn('You route "%s" did not register any routes!', route._ref);
            this.logger.warn('The file path for this route is: \n"%s"', route._filepath);
            this.logger.warn('You need to provide a valid TrackFinder route.');
            this.logger.warn('Be warned, things might not work as you expect.');
        }

        app.use.apply(app, args);

        routers.push(router);

    }, this);

    // console.log('routes', app._router.stack)
    return routers;
}

module.exports = mountRouteFiles;
