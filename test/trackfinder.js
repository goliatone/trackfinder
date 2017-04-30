'use strict';
const test = require('tape');
const resolve = require('path').resolve;
const TrackFinder = require('..').TrackFinder;

test('TrackFinder addFileFilter should be stored in filters', (t) => {

    let tracker = new TrackFinder();
    let test = function(){};

    let expected = tracker.filters.concat([test]);
    tracker.addFileFilter(test);
    t.deepEquals(tracker.filters, expected);
    t.end();
});

test('')
