'use strict';

module.exports = function(app, options){
    app.use('/throw-error', function(req, res, next){
        next( Error('Test Error'));
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
};

/*
 * NOTE: We have to set priority after we define our
 * exports. If we set priority first and then we set
 * exports we would override the `module.exports`
 * object.
 */
module.exports.priority = 60000;
