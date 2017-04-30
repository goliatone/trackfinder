'use strict';
const fs = require('fs');
const _path = require('path');

function findFiles(directory) {
    let files = [];
    let route, name;

    //TODO: Figure out how to handle relative paths to doc
    // var directory = this.path;

    let fileFound = function(path, file) {
        if (this.filterFile(file)) {
            return this.logger.info('Filtering out the file "%s".', file);
        }

        name = file.substr(0, file.indexOf('.'));

        var filepath = _path.join(path, name);

        this.logger.info('Scanning filename:', filepath);

        /*
         * Dynamically include and initialize all route files.
         */
        try {
            route = require(filepath);
            route._ref = name;
            route._filepath = filepath;
            files.push(route);
        } catch (e) {
            this.logger.error(e);
        }

    }.bind(this);

    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach(fileFound.bind(this, directory));
    } else if (fs.existsSync(directory + '.js')) {
        //TODO: Make this robust. Right now this is a weak solution to have it
        //working :/
        fileFound('', directory + '.js');
    }

    return files;
}

module.exports = findFiles;
