'use strict';

module.exports = function(app, options) {
    options.logger.info('- pets: register routes');

    /*
     * We can override /api routes.
     *
     * We need to:
     * - load this route before API.
     * - provide the full route
     *
     * that is, not use the mountpath.
     */
    app.get('/api/pets', function(req, res){
        res.json(module.exports.response);
    });
};

module.exports.response = {
    pets: [
        'Colonel Meow',
        'Choupette',
        'Casper',
        'Chase No Face',
        'Cherry Pop',
        'Merry the Talking Cat'
    ]
};
