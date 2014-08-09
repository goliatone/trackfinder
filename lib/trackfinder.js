/*
 * trackfinder
 * https://github.com/goliatone/trackfinder
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
'use strict';
var express = require('express');
var extend = require('extend');
var _path = require('path');
var fs = require('fs');

var DEFAULTS = {
    // path:'routes/**/*.js',
    path: 'routes',
    verbs: ['get', 'post', 'put', 'patch', 'delete'],
    filters: [
        function(file) {
            return file === 'index.js';
        }
    ]
};

function TrackFinder() {}

TrackFinder.instance = function() {
    if (this._instance) return this._instance;
    this._instance = new TrackFinder();
    return this._instance;
};

TrackFinder.prototype.setOptions = function(options) {
    options || (options = {});
    extend(true, this, DEFAULTS, options);
};

TrackFinder.prototype.addFileFilter = function(filter) {
    this.filters.push(filter);
};

TrackFinder.prototype.filterFile = function(file) {
    return this.filters.some(function(filter) {
        return filter(file);
    });
};

TrackFinder.prototype.logger = console;

TrackFinder.prototype.find = function() {
    var files = [];
    var route, name;
    //TODO: Figure out how to handle relative paths to doc
    var directory = this.path;
    fs.readdirSync(directory).forEach(function(file) {

        if (this.filterFile(file)) return this.logger.info('Filtering', file);

        name = file.substr(0, file.indexOf('.'));
        this.logger.log('scanning file', name)
        /*
         * Dynamically include and initialize all route files.
         */
        try {
            route = require(_path.join(directory, name));
            route._ref = name;
            files.push(route);
        } catch (e) {
            this.logger.error(e);
        }

    }.bind(this));

    return files;
};

TrackFinder.prototype.register = function(app, options) {

    this.setOptions(options);

    var routeFiles = this.find(this.path);

    routeFiles.sort(function(a, b) {
        return a.priority < b.priority ? -1 : 1;
    });

    var router, args;
    routeFiles.forEach(function(route) {
        args = [];
        router = express.Router();

        this.logger.log('route', route._ref);

        //Route can export namespace
        if (route.using) args.push(_get(route, 'using'));

        args.push(router);

        if (_isFunction(route)) route(router, options);

        if (_isFunction(route.register)) route.register(router, options);

        if (route.routes) {
            var handler, verb, parameters, bits;
            Object.keys(route.routes).forEach(function(key) {
                handler = route.routes[key];
                bits = key.split(' ');
                verb = bits[0].toLowerCase();
                parameters = bits[1];
                //console.log('verb', verb, 'parameters', parameters)
                router[verb].call(router, parameters, handler);
            });
        }

        this.verbs.forEach(function(verb) {
            if (!_isFunction(route[verb])) return;
            router[verb].call(router, route.resource, route[verb]);
        });

        app.use.apply(app, args);

    }.bind(this));

    // console.log('routes', app._router.stack)
};

var _isFunction = function(fn) {
    return typeof fn === 'function';
};

var _get = function(obj, prop) {
    if (typeof obj.prop === 'function') return obj[prop].call(obj);
    return obj[prop];
};

module.exports = TrackFinder.instance();