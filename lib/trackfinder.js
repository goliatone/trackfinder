/*
 * trackfinder
 * https://github.com/goliatone/trackfinder
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
'use strict';
var express = require('express'),
    //TODO: Use gextend!
    extend = require('extend'),
    _path = require('path'),
    fs = require('fs');

const _get = require('./utils').get;
const _isFunction = require('./utils').isFunction;

var DEFAULTS = {
    // path:'routes/**/*.js',
    config: {},
    path: 'routes',
    mountpath: 'using',
    logger: console,
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

TrackFinder.prototype.find = function(path) {
    path = path || this.path;

    var files = [];
    var route, name;

    var directory = path;
    if(!_path.isAbsolute(directory)){
        directory = _path.resolve(path);
    }

    this.logger.info('trackfinder directory: "%s"', directory);

    var fileFound = function(path, file) {
        if (this.filterFile(file)){
            return this.logger.info('Filtering', file);
        }

        name = file.substr(0, file.indexOf('.'));

        this.logger.info('scanning file: %s', name);

        /*
         * Dynamically include and initialize all route files.
         */
        try {
            route = require(_path.join(path, name));
            route._ref = name;
            files.push(route);
        } catch (e) {
            this.logger.error(e.message, e.stack);
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

    var routeFiles = [];
    var paths = Array.isArray(this.path) ? this.path : [this.path];

    paths.map(function(path){
        routeFiles = routeFiles.concat(this.find(path));
    }, this);

    routeFiles.sort(this.priorityFilter);

    this.logger.info('LOAD FILES: %s', routeFiles);

    var router, args, routers = [];
    routeFiles.forEach(function(route) {
        args = [];
        router = express.Router();
        this.logger.info('route: %s', route._ref);

        //Route can export namespace
        if (route.using) args.push(_get(route, this.mountpath));

        args.push(router);

        if (_isFunction(route)) route(router, config, app);

        if (_isFunction(route.register)) route.register(router, config, app);

        if (route.routes) {
            var handler, verb, parameters, bits;
            Object.keys(route.routes).forEach(function(key) {
                handler = route.routes[key];
                bits = key.split(' ');
                verb = bits[0].toLowerCase();
                parameters = bits[1];
                this.logger.info('verb %s, parameters %s', verb, parameters);
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

    return routers;
};

module.exports = TrackFinder.instance();
