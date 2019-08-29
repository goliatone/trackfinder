'use strict';
const test = require('tape-catch');
const resolve = require('path').resolve;
const DEFAULTS = require('../lib/defaults');
const TrackFinder = require('..').TrackFinder;

test('defaults are exposed in TrackFinder.DEFAULTS', (t)=>{
    t.deepEquals(DEFAULTS, TrackFinder.DEFAULTS, 'defaults should be exposed');
    t.end();
});

test('TrackFinder should inherit defaults on constructor', (t) => {
    let tracker = new TrackFinder();
    Object.keys(DEFAULTS).map((key) => {
        t.deepEquals(tracker[key], DEFAULTS[key], `${key} should be equal`);
    });
    t.end();
});

test('We should be able to override default values', (t)=>{
    let options = {
        path: 'override',
        basepath: 'override',
        mountpath: 'override',
        middleware: 'override',
    };

    let tracker = new TrackFinder(options);

    Object.keys(options).map((key)=>{
        t.deepEquals(tracker[key], options[key], `${key} should be equal`);
    });
    t.end();
});

test('We should be able to override instance methods', (t) => {
    let options = {
        normalizePath: function(){}
    };
    let tracker = new TrackFinder(options);
    t.deepEquals(tracker.normalizePath, options.normalizePath, 'Extended method');
    t.end();
});
