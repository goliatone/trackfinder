'use strict';


function isFunction(fn) {
    return typeof fn === 'function';
}

function get(obj, prop) {
    if (typeof obj.prop === 'function') {
        return obj[prop].call(obj);
    }
    return obj[prop];
}

module.exports.get = get;

module.exports.isFunction = isFunction;
