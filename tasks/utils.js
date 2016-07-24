'use strict';

var argv = require('yargs').argv;

module.exports.replace = function (str, patterns) {
    Object.keys(patterns).forEach(function (pattern) {
        var matcher = new RegExp('{{' + pattern + '}}', 'g');
        str = str.replace(matcher, patterns[pattern]);
    });
    return str;
};

// Fixes https://github.com/nodejs/node-v0.x-archive/issues/2318
module.exports.spawnablePath = function (path) {
    if (process.platform === 'win32') {
        return path + '.cmd';
    }
    return path;
};
