# trackfinder

Express route finder and loader.

This library will autoload route files that finds under any specified directory.

## Getting Started
Install the module with: `npm install trackfinder`

This library will autoload route files that finds under any specified directory.

Instead of doing this:

```javascript
const app = express();

const routes = require('./routes/index');
const users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);
```

You can do this:

```javascript
const app = express();
const TrackFinder = require('trackfinder');

TrackFinder.register(app, {
    path:'./routes'
});
```

This will load all files inside the **routes** directory.

TrackFinder supports different route file formats. The most simple route file would look like this:

```js
'use strict';

module.exports = function(app, config) {
    console.log('- pets: register routes');

    app.get('/pets', function(req, res){
        res.json({
            pets: [
                'Colonel Meow',
                'Casper',
                'Chase No Face',
                'Cherry Pop'
            ]
        });
    });
};
```

## Documentation

### Options

* [path](#path)
* [logger](#logger)
* [mountpath](#mountpath)
* [middleware](#middleware)
* [priorityFilter](#priorityfilter)
* [filters](#filters)
* [methods](#methods)

##### path
* Default: 'routes'

Path to directory containing route files.

##### logger
* Default: `console`
 Logger instance.

##### mountpath
If present it will be passed as the first argument to the call`app.use(mountpath, ...)`.

See [express mountpath][express-mountpath]

##### middleware
This get's applied to the router, not to individual routes.

##### priorityFilter
Function to order route files which determines the order in which the routes are mounted.

##### filters
Function to filter out files from `path`.

##### methods


### Routes

#### Route options

* priority: Property that will be used by `priorityFilter` and will determine route order.
* mountpath: See [express mountpath][express-mountpath]
* middleware: Array of middleware functions. This get's applied to the router, not to individual routes.

#### Route file formats
Your route files can be in different formats.


## Examples

```javascript
const express = require('express');
const TrackFinder = require('trackfinder');
const app = express();

TrackFinder.register(app);

app.listen(3000, function(){
    console.log('Express server running');
});
```

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 goliatone  
Licensed under the MIT license.

## TODO:
Integrate file finder stuff:
https://www.npmjs.org/package/file-magic
Order:
https://github.com/eladb/node-jsplugs

[express-mountpath]:http://expressjs.com/en/4x/api.html#app.mountpath
