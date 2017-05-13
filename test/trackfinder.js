'use strict';
const fs = require('fs');
const test = require('tape-catch');
const TrackFinder = require('..').TrackFinder;

test('TrackFinder addFileFilter should be stored in filters', (t) => {

    let tracker = new TrackFinder();
    let test = function(){};

    let expected = tracker.filters.concat([test]);
    tracker.addFileFilter(test);
    t.deepEquals(tracker.filters, expected);
    t.end();
});

test('TrackFinder normalizePath should return a path by default', (t) => {
    let tracker = new TrackFinder();
    t.ok(tracker.normalizePath(), 'should return a path');
    t.end();
});

test('TrackFinder should resolve non absolute paths', (t) => {
    let tracker = new TrackFinder();
    let expected = tracker.basepath + '/fixtures';
    let normalized = tracker.normalizePath('./fixtures');
    t.same(normalized, expected);
    t.end();
});

test('TrackFinder should resolve use basepath to normalize paths', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let expected = tracker.basepath + '/fixtures';
    let normalized = tracker.normalizePath('./fixtures');
    t.same(normalized, expected);
    t.end();
});

test('TrackFinder should normalize an array of paths', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let expected = [
        tracker.basepath + '/fixtures/route',
        tracker.basepath + '/fixtures/routes'
    ];

    let normalized = tracker.normalizePath([
        './fixtures/route',
        './fixtures/routes'
    ]);

    t.same(normalized, expected);
    t.end();
});

test('TrackFinder normalized path should exists', (t) => {
    let tracker = new TrackFinder({
        basepath: __dirname
    });

    let normalized = tracker.normalizePath('./fixtures');

    t.ok(fs.existsSync(normalized));
    t.end();
});

test('TrackFinder addFileFilter should be stored in filters', (t)=>{
    let tracker = new TrackFinder();
    let expected = tracker.filters.concat([test]);
    tracker.addFileFilter(test);
    t.deepEquals(tracker.filters, expected);
    t.end();
});

test('TrackFinder filterFile should return true if a filter applies to ar filename', (t)=> {
    let tracker = new TrackFinder();
    t.ok(tracker.filterFile('index.js'));
    t.end();
});
