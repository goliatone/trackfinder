'use strict';
const test = require('tape');
const resolve = require('path').resolve;
const TrackFinder = require('..');

test('TrackFinder addFileFilter should be stored in filters', (t)=>{
    let test = function(){};
    let expected = TrackFinder.filters.concat([test]);
    TrackFinder.addFileFilter(test);
    t.deepEquals(TrackFinder.filters, expected);
    t.end();
});

test('TrackFinder normalizePath should return a path by default', (t)=>{
    t.ok(TrackFinder.normalizePath(), 'should return a path');
    t.end();
});

test('TrackFinder should resolve non absolute paths', (t)=>{
    TrackFinder.basepath = __dirname;
    let expected = __dirname;
    let normalized = TrackFinder.normalizePath('./fixtures');
    t.same(normalized, expected);
    t.end();
});

test('TrackFinder filterFile should return true if a filter applies to ar filename', (t)=> {
    //By default we ignore index.js files
    t.ok(TrackFinder.filterFile('index.js'));
    t.end();
});

test.only('TrackFinder should find route files in a directory', (t) => {
    TrackFinder.setOptions();
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
