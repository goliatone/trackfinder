'use strict';
const test = require('tape');

const utils = require('../lib/utils');
const get = utils.get;
const isFunction = utils.isFunction;

test('isFunction should return true if given a function', (t) => {
    t.ok(isFunction(function(){}), 'OK function.');
    t.end();
});

test('isFunction should return false if given a function', (t) => {
    t.notOk(isFunction('01.first-command'), 'OK not function.');
    t.end();
});

test('isFunction should return false no argument', (t) => {
    t.notOk(isFunction(), 'OK not function.');
    t.end();
});

test('get should return a property of an object by name', (t)=>{
    let a = {prop: 'expected'};
    t.equals(get(a, 'prop'), 'expected');
    t.end();
});

test('get should return a property of an object by name if the property is a function', (t)=>{
    let a = {prop: () => 'expected'};
    t.equals(get(a, 'prop'), 'expected');
    t.end();
});
