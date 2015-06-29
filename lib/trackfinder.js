/*
 * trackfinder
 * https://github.com/goliatone/trackfinder
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
'use strict';
var express = require('express'),
    debug = require('debug')('trackfinder'),
    //TODO: Use gextend!
    extend = require('extend'),
    _path = require('path'),
    fs = require('fs');

var DEFAULTS = {
    // path:'routes/**/*.js',
    path: 'routes',
    mountpath: 'using',
    config: {},
    priorityFilter:function(a, b) {
        return a.priority < b.priority ? -1 : 1;
    },
    verbs: ['get', 'post', 'put', 'patch', 'delete'],
    filters: [
        function(file) {
            return file === 'index.js';
        }
    ]
};

function TrackFinder() {}
TrackFinder.DEFAULTS = DEFAULTS;

TrackFinder.instance = function() {
    if (this._instance) return this._instance;
    this._instance = new TrackFinder();
    return this._instance;
};

TrackFinder.prototype.setOptions = function(options) {
    options || (options = {config: {}});
    //TODO: Use gextend!
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
    var directory = _path.resolve(this.path);

    var fileFound = function(path, file) {
        if (this.filterFile(file)) return this.logger.info('Filtering', file);

        name = file.substr(0, file.indexOf('.'));
        console.log('scanning file', name);

        /*
         * Dynamically include and initialize all route files.
         */
        try {
            route = require(_path.join(path, name));
            route._ref = name;
            files.push(route);
        } catch (e) {
            this.logger.error(e);
        }
    }.bind(this);

    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(fileFound.bind(this, directory));

    } else if (fs.existsSync(directory + '.js')) {
        //TODO: Make this robust. Right now this is a weak solution to have it
        //working :/
        fileFound('', directory + '.js');
    }

    return files;
};

TrackFinder.prototype.register = function(app, options) {

    this.setOptions(options);

    var config = this.config;

    var routeFiles = this.find(this.path);

    routeFiles.sort(this.priorityFilter);
    console.log('LOAD FILES', routeFiles);
    var router, args, routers = [];
    routeFiles.forEach(function(route) {
        args = [];
        router = express.Router();
        console.log('route', route._ref);
        //Route can export namespace
        if (route.using) args.push(_get(route, this.mountpath));

        args.push(router);

        if (_isFunction(route)) route(router, config);

        if (_isFunction(route.register)) route.register(router, config);

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

        routers.push(router);

    }.bind(this));

    // console.log('routes', app._router.stack)
    return routers;
};

function _isFunction(fn) {
    return typeof fn === 'function';
}

function _get(obj, prop) {
    if (typeof obj.prop === 'function'){
        return obj[prop].call(obj);
    }
    return obj[prop];
}

module.exports = TrackFinder.instance();
