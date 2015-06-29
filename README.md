# trackfinder

Simple Express route finder

## Getting Started
Install the module with: `npm install trackfinder`

```javascript
var TrackFinder = require('trackfinder');

var app = express();


TrackFinder.register(app, {
    path:'./routes',
    config: config
});
```

This will load all files inside the **routes** directory. The most simple route file would look like this:

```js
'use strict';

module.exports = function(app, options){
    console.log('- pets: register routes');

    app.get('/pets', function(req, res){
        res.json({
            pets: ['Colonel Meow', 'Casper', 'Chase No Face', 'Cherry Pop']
        });
    });
};
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 goliatone  
Licensed under the MIT license.

## TODO:
Integrate file finder stuff:
https://www.npmjs.org/package/file-magic
