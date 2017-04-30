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

function TrackFinder() {}
TrackFinder.DEFAULTS = DEFAULTS;

TrackFinder.instance = function() {
    if (this._instance) {
        return this._instance;
    }

    this._instance = new TrackFinder();
    return this._instance;
};

TrackFinder.prototype.setOptions = function(options={}) {

    options = extend(this, DEFAULTS, options);

    return options;
};

TrackFinder.prototype.addFileFilter = function(filter) {
    this.filters.push(filter);
};

TrackFinder.prototype.filterFile = function(file) {
    return this.filters.some(function(filter) {
        return filter(file);
    });
};

TrackFinder.prototype.normalizePath = function(filepath) {
    if(!filepath) {
        filepath = _path.join(__dirname, 'routes');
    }
    if(!_path.isAbsolute(filepath)){
        filepath = _path.resolve(filepath);
    }

    return filepath;
};

TrackFinder.prototype.register = function(app, options) {
    options = this.setOptions(options);

    this.path = this.normalizePath(this.path);

    let routeFiles = this.find(this.path);

    routeFiles.sort(this.priorityFilter);

    this.logger.info('Route files will be loaded in this order: \n', routeFiles.map((f) => f._ref));

    return this.mount(app, options, routeFiles);
};


TrackFinder.prototype.find = require('./findFiles');

TrackFinder.prototype.mount = require('./mountRouteFiles');


//@TODO: We need to export TrackFinder, not instance.
module.exports = TrackFinder.instance();
