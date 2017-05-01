/*
 * trackfinder
 * https://github.com/goliatone/trackfinder
 *
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
'use strict';
const extend = require('gextend');
const _path = require('path');
const _get = require('./utils').get;
const _isFunction = require('./utils').isFunction;

var DEFAULTS = require('./defaults');

function TrackFinder(options={}) {
    this.init(options);
}

TrackFinder.prototype.init = function(options={}) {
    options = extend({}, DEFAULTS, options);
    this.options = extend(this, options);
};

TrackFinder.instance = function() {
    if (this._instance) {
        return this._instance;
    }

    this._instance = new TrackFinder();
    return this._instance;
};

TrackFinder.prototype.setOptions = function(options={}) {
    this.logger.warn('setOptions will be deprecated. Use extendWithOptions');
    return this.extendWithOptions(options);
};

TrackFinder.prototype.extendWithOptions = function(options={}) {
    //we need to collect what properties are not defaults and save those.
    options = extend({}, DEFAULTS, this.options, options);

    extend(this, options);

    return options;
};

TrackFinder.prototype.addFileFilter = function(filter) {
    if(!this.filters) this.filters = [];
    this.filters.push(filter);
};

TrackFinder.prototype.filterFile = function(file) {
    if(!this.filters) this.filters = [];
    return this.filters.some(function(filter) {
        return filter(file);
    });
};

TrackFinder.prototype.normalizePath = function(filepath) {

    if(Array.isArray(filepath)) {
        return filepath.map(this.normalizePath.bind(this));
    }

    if(!filepath) {
        filepath = _path.join(this.basepath, 'routes');
    }

    console.log('filepath', filepath);
    if(!_path.isAbsolute(filepath)) {
        filepath = _path.resolve(this.basepath, filepath);
    }

    return filepath;
};

TrackFinder.prototype.register = function(app, options) {
    options = this.extendWithOptions(options);

    this.path = this.normalizePath(options.path);

    var paths = this.path;
    if(!Array.isArray(this.path)) {
        paths = [paths];
    }

    let routeFiles = [];

    paths.map(function(path) {
        path = this.find(path);
        console.log('path', path);
        routeFiles = routeFiles.concat(path);
    }, this);

    routeFiles = this.sortRouteFiles(routeFiles);

    this.logger.info('Route files will be loaded in this order: \n', routeFiles.map((f) => f._ref));

    return this.mount(app, options, routeFiles);
};

TrackFinder.prototype.sortRouteFiles = function(routes=[]) {
    return routes.sort(this.priorityFilter);
};

TrackFinder.prototype.find = require('./findFiles');

TrackFinder.prototype.mount = require('./mountRouteFiles');

TrackFinder.prototype.registerRouteFile = function(path, file) {
    if (this.filterFile(file)) {
        return this.logger.info('Filtering out the file "%s".', file);
    }

    let route, name;

    name = file.substr(0, file.indexOf('.'));

    var filepath = _path.join(path, name);

    this.logger.info('Scanning filename:', filepath);

    /*
     * Dynamically include and initialize all route files.
     */
    try {
        route = require(filepath);
        route._ref = name;
        route._filepath = filepath;
    } catch (e) {
        this.logger.error(e);
    }

    return route;
};

// Object.defineProperty(TrackFinder.prototype, 'path', {
// 	get : function () {
// 		return this.normalizePath(this._path);
// 	},
// 	set : function (val) {
// 		this._path = val;
// 	}
// });
//
// Object.defineProperty(TrackFinder.prototype, 'basepath', {
// 	get : function () {
// 		return this._basepath || __dirname;
// 	},
// 	set : function (val) {
// 		this._basepath = val;
// 	}
// });

TrackFinder.DEFAULTS = DEFAULTS;

//@TODO: We need to export TrackFinder, not instance.
module.exports = TrackFinder.instance();
module.exports.TrackFinder = TrackFinder;
