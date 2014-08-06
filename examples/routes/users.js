var Route = {};

Route.priority = 10;
Route.using = '/api';
Route.register = function(app, options){
    console.log('- users: register routes');
    app.get('/peperone', function(req, res){
        res.send('Peperone is here, mofos!');
    });
};

module.exports = Route;