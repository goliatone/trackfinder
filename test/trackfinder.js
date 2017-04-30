'use strict';
const test = require('tape');
const resolve = require('path').resolve;
const TrackFinder = require('../lib');

test('TrackFinder has DEFAULTS', (t) => {
    t.ok(TrackFinder.constructor.DEFAULTS, 'OK defaults.');
    t.end();
});

test('TrackFinder setOptions should merge DEFAULTS', (t)=>{

    let DEFAULTS = TrackFinder.constructor.DEFAULTS;
    let options = TrackFinder.setOptions();

    Object.keys(DEFAULTS).map((key)=>{
        t.deepEquals(options[key], DEFAULTS[key], `${key} should be equal`);
    });

    t.end();
});

test('TrackFinder addFileFilter should be stored in filters', (t)=>{
    let test = function(){};
    let expected = TrackFinder.filters.concat([test]);
    TrackFinder.addFileFilter(test);
    t.deepEquals(TrackFinder.filters, expected);
    t.end();
});

test('TrackFinder filterFile should return true if a filter applies to ar filename', (t)=> {
    //By default we ignore index.js files
    t.ok(TrackFinder.filterFile('index.js'));
    t.end();
});

test('TrackFinder should find route files in a directory', (t) => {
    let files = TrackFinder.find(('./test/fixtures/routes'));
    t.equals(files.length, 2, 'Should find files');
    t.end();
});

test('TrackFinder should register route files in a directory', (t) => {
    let app = {
        use: function(){}
    };

    let routers = TrackFinder.register(app, {
        path: './test/fixtures/routes',
        config: {}
    });

    t.equals(routers.length, 2, 'Should return a router per route file');
    t.end();
});
