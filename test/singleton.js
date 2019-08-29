'use strict';
const test = require('tape-catch');
const resolve = require('path').resolve;
const TrackFinder = require('..');




test.only('TrackFinder should find route files in a directory', (t) => {
    TrackFinder.setOptions();
    TrackFinder.basepath = __dirname;
    let routes = TrackFinder.normalizePath('./fixtures/routes');
    let files = TrackFinder.find(routes);
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
