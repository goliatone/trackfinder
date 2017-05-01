'use strict';
const test = require('tape');
const resolve = require('path').resolve;
const TrackFinder = require('..').TrackFinder;

test('TrackFinder should find route files in a directory', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let routes = ('./fixtures/routes');
    let files = tracker.find(routes);

    t.equals(files.length, 2, 'Should find files');
    t.end();
});

test('TrackFinder should find route files in a directory', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let routes = ('./fixtures/routes');
    let files = tracker.find(routes);
    files.map((file) => {
        t.ok(file._ref, 'Route file has name');
        t.ok(file._filepath, 'Route file has path');
    });
    t.end();
});

test('TrackFinder should find route files in a directory', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let routes = ('./fixtures/route');
    let files = tracker.find(routes);
    t.equal(files[0]._ref, 'profiles');
    t.equal(files[0]._filepath, __dirname +'/fixtures/route/profiles');
    t.end();
});

test('TrackFinder should find route files in a directory', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let app = {
        use: function(){}
    };
    let routes = [
        './fixtures/route',
        './fixtures/routes'
    ];
    let files = tracker.register(app, {
        path: routes
    });
    t.equals(files.length, 3, 'Should find files');
    t.end();
});


test('', (t) => {
    t.end();
});
