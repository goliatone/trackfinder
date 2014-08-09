/*
 * trackfinder
 * https://github.com/goliatone/trackfinder
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
'use strict';
var express = require('express');
var utils = require('util');
var extend = require('extend');
var _path = require('path');
var fs = require('fs');

var DEFAULTS = {
	// path:'routes/**/*.js',
	path:'routes',
    verbs: ['get', 'post', 'put', 'patch', 'delete'],
    filters:[function(file){
    	return file === 'index.js';
    }]
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

TrackFinder.prototype.addFileFilter = function(filter){
	this.filters.push(filter);
};

TrackFinder.prototype.filterFile = function(file){
	return this.filters.some(function(filter){
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
        console.log('scanning file', name)
        /*
         * Dynamically include and initialize all route files.
         */
        route = require('./'+ _path.join(directory,name));
        route._ref = name;
        files.push(route);

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
        console.log('route', route._ref);
        //Route can export namespace
        if (route.using) args.push(_get(route, 'using'));

        args.push(router);

        if(_isFunction(route)) route(router, options);

        if (_isFunction(route.register)) route.register(router, options);

        if(route.routes){
            var handler, verb, parameters, bits;
            Object.keys(route.routes).forEach(function(key){
                handler = route.routes[key];
                bits = key.split(' ');
                verb = bits[0].toLowerCase();
                parameters = bits[1];
                //console.log('verb', verb, 'parameters', parameters)
                router[verb].call(router, parameters, handler );
            });
        }

        this.verbs.forEach(function(verb) {
            if (_isFunction(route[verb])) router[verb].call(router, route.resource, route[verb]);
        });

        //console.log('REGISTER', args)
        app.use.apply(app, args);
        //app.use('/' + route._ref, router);

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

var Route = {
    using: 'api_namespace',
    register: function(app) {},
    routes: {
        'GET /resources': function(req, res) {},
        'GET /:resource/:id': function(req, res) {},
        'POST /:resource': function(req, res) {},
        'PUT /:resource/:id': function(req, res) {},
        'PATCH /:resource': function(req, res) {},
        'DELETE /:resource/:id': function(req, res) {}
    }
}

module.exports = TrackFinder.instance();