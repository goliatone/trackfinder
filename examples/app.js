'use strict';

const express = require('express');
const TrackFinder = require('../index');

const app = express();


 let logger = isTest() ? require('noop-console')({}) : console;

TrackFinder.register(app, {
    path: __dirname + '/routes',
    logger: logger,
    config: {
        logger: logger
    }
});

module.exports = app;

function isTest() {
    return process.env.NODE_ENV === 'test';
}
