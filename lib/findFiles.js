'use strict';
const fs = require('fs');
const _path = require('path');

function findFiles(directory='') {

    //Do we want to do this here?
    directory = this.normalizePath(directory);

    console.log('==> directory', directory);

    let files = [];

    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(function(file) {
            console.log('file', file);
            let route = this.registerRouteFile(directory, file);
            files.push(route);
        }, this);

    } else if (fs.existsSync(directory + '.js')) {
        //TODO: Make this robust. Right now this is a weak solution to have it
        //working :/
        let route = this.registerRouteFile('', directory + '.js');
    }

    return files.filter(Boolean);
}

module.exports = findFiles;
