'use strict';

module.exports = {
    path: './routes',
    logger: console,
    mountpath: 'mountpath',
    middleware: 'middleware',
    priorityFilter: function(a, b) {
        return a.priority < b.priority ? -1 : 1;
    },
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    filters: [
        function(file) {
            return file === 'index.js';
        }
    ]
};
